export interface PersonalityOption {
  text: string;
  characterScores: Record<string, number>;
}

export interface PersonalityQuestion {
  id: number;
  question: string;
  options: PersonalityOption[];
}

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    id: 1,
    question: "You see a classmate struggling to carry a huge stack of heavy art projects. What do you do?",
    options: [
      {
        text: "Step in immediately, offer a big smile, and help carry half the stack so no one gets left behind.",
        characterScores: { "liu-bei": 3, "zhao-yun": 2, "sun-shangxiang": 2 }
      },
      {
        text: "Charge ahead to grab the heaviest box yourself because you love testing your strength!",
        characterScores: { "zhang-fei": 3, "guan-yu": 2, "lu-bu": 1, "gan-ning": 3 }
      },
      {
        text: "Quickly organize a team of three friends and assign each person the lightest items to carry efficiently.",
        characterScores: { "zhuge-liang": 3, "cao-cao": 2, "zhou-yu": 1, "xun-yu": 3 }
      },
      {
        text: "Observe from a distance first to see if they really need help, then step in if it fits your plan.",
        characterScores: { "sima-yi": 3, "sun-quan": 2, "jiang-wei": 1 }
      }
    ]
  },
  {
    id: 2,
    question: "When playing a complex board game or puzzle game, what is your favorite winning style?",
    options: [
      {
        text: "Outsmarting everyone with clever surprise moves and reading the rulebook ahead of time.",
        characterScores: { "zhuge-liang": 3, "sima-yi": 2, "zhou-yu": 2, "jiang-wei": 2 }
      },
      {
        text: "Building a strong team with your best friends so everyone plays fairly and wins together.",
        characterScores: { "liu-bei": 3, "sun-quan": 2, "xun-yu": 2 }
      },
      {
        text: "Making bold, decisive moves and capturing as many pieces as possible!",
        characterScores: { "cao-cao": 3, "guan-yu": 2, "lu-bu": 2, "gan-ning": 3 }
      },
      {
        text: "Defending your base carefully until the other players make a mistake.",
        characterScores: { "sima-yi": 3, "zhao-yun": 2, "sun-shangxiang": 1 }
      }
    ]
  },
  {
    id: 3,
    question: "What quality do you value most in a good friend?",
    options: [
      {
        text: "Unbreakable loyalty—standing by your side no matter how tough things get.",
        characterScores: { "guan-yu": 3, "zhang-fei": 3, "zhao-yun": 2, "jiang-wei": 3, "sun-shangxiang": 2 }
      },
      {
        text: "Kindness and empathy—always caring about how people feel.",
        characterScores: { "liu-bei": 3, "diao-chan": 2, "xun-yu": 2 }
      },
      {
        text: "Wisdom and creative ideas—someone who can give great advice when you're stuck.",
        characterScores: { "zhuge-liang": 3, "zhou-yu": 2, "xun-yu": 2 }
      },
      {
        text: "Confidence and ambition—someone who dares to dream big!",
        characterScores: { "cao-cao": 3, "sun-quan": 2, "gan-ning": 2 }
      }
    ]
  },
  {
    id: 4,
    question: "If you could choose a special skill or superpower for an adventure, what would it be?",
    options: [
      {
        text: "Mastering strategy and predicting what will happen next.",
        characterScores: { "zhuge-liang": 3, "zhou-yu": 2, "xun-yu": 2, "jiang-wei": 2 }
      },
      {
        text: "Unstoppable physical strength and martial arts agility.",
        characterScores: { "guan-yu": 2, "zhang-fei": 3, "lu-bu": 3, "sun-shangxiang": 3, "gan-ning": 3 }
      },
      {
        text: "Incredible charm and the ability to unite people behind a common goal.",
        characterScores: { "liu-bei": 3, "cao-cao": 2, "sun-quan": 2, "xun-yu": 1 }
      },
      {
        text: "Steel-like patience and the ability to stay calm under immense pressure.",
        characterScores: { "sima-yi": 3, "zhao-yun": 3, "jiang-wei": 2 }
      }
    ]
  }
];
