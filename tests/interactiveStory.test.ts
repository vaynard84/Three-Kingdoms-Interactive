import test from 'node:test';
import assert from 'node:assert/strict';
import { STORY_BRANCHES } from '../src/data/storyBranches.ts';
import { CHAPTERS } from '../src/data/chapters.ts';
import {
  MAX_STORY_DECISIONS,
  createLocalContinuation,
  createStoryConclusion,
  normalizeGeneratedScene,
  parseStoryContinuationRequest,
  shouldConcludeStory,
  type StoryContinuationRequest
} from '../src/services/interactiveStory.ts';
import type { StoryHistoryEntry } from '../src/types.ts';

function requestWithHistory(history: StoryHistoryEntry[] = []): StoryContinuationRequest {
  return {
    currentBranchId: STORY_BRANCHES[0].id,
    chapterId: STORY_BRANCHES[0].chapter_id,
    choiceText: 'Share grain with hungry farming families',
    choiceNext: 'ch1-share-grain',
    history
  };
}

test('every chapter has one playable starting branch with two choices', () => {
  assert.equal(STORY_BRANCHES.length, CHAPTERS.length);
  assert.deepEqual(
    STORY_BRANCHES.map(branch => branch.chapter_id),
    CHAPTERS.map(chapter => chapter.id)
  );

  for (const branch of STORY_BRANCHES) {
    assert.ok(branch.id);
    assert.equal(branch.choices.length, 2);
    assert.ok(branch.choices.every(choice => choice.text && choice.next));
  }
});

test('request parsing retains the stable next identifier and sanitizes history', () => {
  const parsed = parseStoryContinuationRequest({
    current_branch_id: STORY_BRANCHES[2].id,
    chapter_id: 3,
    current_scene_id: ' scene-2 ',
    choice_text: ' Make the promise ',
    choice_next: ' three-heroes-born ',
    history: [
      {
        sceneId: 'scene-1',
        userChoice: 'First choice',
        choiceNext: 'first-choice',
        outcome: 'A useful outcome.'
      },
      { malformed: true }
    ]
  });

  assert.ok(parsed);
  assert.equal(parsed?.choiceNext, 'three-heroes-born');
  assert.equal(parsed?.history.length, 1);
  assert.equal(parsed?.chapterId, 3);
});

test('malformed AI output is repaired with two continuation choices', () => {
  const scene = normalizeGeneratedScene(
    {
      outcome: 'The plan works.',
      historical_context: 'A grounded fact.',
      next_scene_title: 'Next scene',
      dialogue: 'The heroes need another plan.',
      choices: []
    },
    requestWithHistory()
  );

  assert.equal(scene.choices.length, 2);
  assert.ok(scene.choices.every(choice => choice.action === 'continue'));
  assert.equal(scene.is_conclusion, false);
});

test('graphic generated content is replaced by the child-safe local continuation', () => {
  const scene = normalizeGeneratedScene(
    {
      outcome: 'A severed head rolls across the field.',
      historical_context: 'Graphic detail.',
      next_scene_title: 'Unsafe scene',
      dialogue: 'More gore follows.',
      choices: [
        { text: 'Continue', next: 'continue' },
        { text: 'Continue again', next: 'continue-again' }
      ]
    },
    requestWithHistory()
  );

  assert.doesNotMatch(scene.outcome.toLowerCase(), /severed head|gore/);
  assert.equal(scene.choices.length, 2);
});

test('a branch concludes after the configured decision count and never dead-ends', () => {
  const history: StoryHistoryEntry[] = [];
  let lastScene = createLocalContinuation(requestWithHistory(history));

  for (let step = 1; step < MAX_STORY_DECISIONS; step += 1) {
    assert.equal(lastScene.choices.length, 2);
    const choice = lastScene.choices[0];
    history.push({
      sceneId: lastScene.scene_id,
      userChoice: choice.text,
      choiceNext: choice.next,
      outcome: lastScene.outcome
    });
    lastScene = createLocalContinuation({
      ...requestWithHistory(history),
      choiceText: choice.text,
      choiceNext: choice.next
    });
  }

  assert.equal(lastScene.is_conclusion, true);
  assert.ok(lastScene.choices.length >= 3);
  assert.deepEqual(
    new Set(lastScene.choices.map(choice => choice.action)),
    new Set(['next-branch', 'read-chapter', 'choose-branch'])
  );
});

test('every offline branch reaches a conclusion with onward navigation', () => {
  for (const branch of STORY_BRANCHES) {
    const history: StoryHistoryEntry[] = [];
    let choice = branch.choices[0];
    let scene = createLocalContinuation({
      currentBranchId: branch.id,
      chapterId: branch.chapter_id,
      choiceText: choice.text,
      choiceNext: choice.next,
      history
    });

    while (!scene.is_conclusion) {
      assert.equal(scene.choices.length, 2, `${branch.id} lost its continuation choices`);
      choice = scene.choices[0];
      history.push({
        sceneId: scene.scene_id,
        userChoice: choice.text,
        choiceNext: choice.next,
        outcome: scene.outcome
      });
      assert.ok(history.length <= MAX_STORY_DECISIONS, `${branch.id} did not converge`);
      scene = createLocalContinuation({
        currentBranchId: branch.id,
        chapterId: branch.chapter_id,
        currentSceneId: scene.scene_id,
        choiceText: choice.text,
        choiceNext: choice.next,
        history
      });
    }

    assert.ok(scene.choices.some(nextChoice => nextChoice.action === 'next-branch'));
    assert.ok(scene.choices.some(nextChoice => nextChoice.action === 'read-chapter'));
    assert.ok(scene.choices.some(nextChoice => nextChoice.action === 'choose-branch'));
  }
});

test('conclusion detection is based on the bounded journey history', () => {
  const history = Array.from({ length: MAX_STORY_DECISIONS - 1 }, (_, index) => ({
    sceneId: `scene-${index}`,
    userChoice: `Choice ${index}`,
    choiceNext: `choice-${index}`,
    outcome: `Outcome ${index}`
  }));
  const request = requestWithHistory(history);

  assert.equal(shouldConcludeStory(request), true);
  assert.equal(createStoryConclusion(request).is_conclusion, true);
});
