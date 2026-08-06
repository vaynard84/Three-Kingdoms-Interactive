import type { StoryBranch } from '../types.ts';

// Canonical starting points for every interactive chapter.
// Both the client and server import this collection so branch IDs, chapter links,
// and opening choices cannot drift apart.
export const STORY_BRANCHES: StoryBranch[] = [
  {
    "id": "ch1_fall_of_han",
    "chapter_id": 1,
    "title": "Ch 1: The Troubled Empire",
    "dialogue": "In the grand capital of Luoyang, corrupt officials raise taxes while drought strikes farming villages. What should young Lord Liu do to help?",
    "choices": [
      {
        "text": "Share grain with hungry farming families",
        "next": "ch1_share_grain"
      },
      {
        "text": "Send an urgent petition to the Imperial Court",
        "next": "ch1_send_petition"
      }
    ]
  },
  {
    "id": "ch2_yellow_turbans",
    "chapter_id": 2,
    "title": "Ch 2: The Yellow Scarves Uprising",
    "dialogue": "Zhang Jue offers herbal remedies and promises a peaceful 'Yellow Sky'. Thousands wrap yellow scarves around their heads!",
    "choices": [
      {
        "text": "Listen to Zhang Jue's herbal teachings",
        "next": "ch2_listen_healer"
      },
      {
        "text": "Rally local volunteers to protect the town",
        "next": "ch2_protect_town"
      }
    ]
  },
  {
    "id": "ch3_peach_garden",
    "chapter_id": 3,
    "title": "Ch 3: The Oath of the Peach Garden",
    "dialogue": "In Zhang Fei's blooming peach orchard, Liu Bei, Guan Yu, and Zhang Fei raise their cups and vow to stand as brothers forever.",
    "choices": [
      {
        "text": "Swear the sacred brotherly oath",
        "next": "ch3_swear_vow"
      },
      {
        "text": "Forge three legendary weapons together",
        "next": "ch3_forge_weapons"
      }
    ]
  },
  {
    "id": "ch4_dong_zhuo",
    "chapter_id": 4,
    "title": "Ch 4: Dong Zhuo at the Palace",
    "dialogue": "General Dong Zhuo marches heavy armor into Luoyang and places 9-year-old Emperor Xian on the throne. Court officials tremble in fear!",
    "choices": [
      {
        "text": "Secretly guide young Emperor Xian to safety",
        "next": "ch4_protect_emperor"
      },
      {
        "text": "Gather brave nobles outside the city walls",
        "next": "ch4_gather_nobles"
      }
    ]
  },
  {
    "id": "ch5_coalition",
    "chapter_id": 5,
    "title": "Ch 5: The Grand Warlord Alliance",
    "dialogue": "Cao Cao and Yuan Shao assemble 18 regional lords at Suanzao. Wine is poured, but commanders argue over who should lead.",
    "choices": [
      {
        "text": "Appoint Yuan Shao as Supreme Commander",
        "next": "ch5_appoint_yuan"
      },
      {
        "text": "Urge the lords to share food supplies and cooperate",
        "next": "ch5_share_supplies"
      }
    ]
  },
  {
    "id": "ch6_hulao_pass",
    "chapter_id": 6,
    "title": "Ch 6: Duel at Hulao Pass",
    "dialogue": "Lü Bu rides the fast Red Hare horse in front of Hulao Pass, swinging his Sky-Piercer Halberd! Zhang Fei roars and charges forward!",
    "choices": [
      {
        "text": "Guan Yu and Liu Bei ride in to fight together",
        "next": "ch6_three_heroes_fight"
      },
      {
        "text": "Challenge Lü Bu to a strategic battle of wits",
        "next": "ch6_battle_of_wits"
      }
    ]
  },
  {
    "id": "ch7_imperial_seal",
    "chapter_id": 7,
    "title": "Ch 7: The Lost Jade Seal",
    "dialogue": "In the burned ruins of Luoyang, Sun Jian sees a rainbow glow rising from Zhenguan Well. A diver brings up a red silk pouch!",
    "choices": [
      {
        "text": "Open the pouch to reveal the Imperial Jade Seal",
        "next": "ch7_reveal_seal"
      },
      {
        "text": "Order troops to extinguish fires and rebuild",
        "next": "ch7_rebuild_city"
      }
    ]
  },
  {
    "id": "ch8_diao_chan",
    "chapter_id": 8,
    "title": "Ch 8: The Clever Chain Plot",
    "dialogue": "Minister Wang Yun and courageous Diao Chan plan a clever strategy to convince Lü Bu that Dong Zhuo is not a righteous leader.",
    "choices": [
      {
        "text": "Show Lü Bu the true value of honor and justice",
        "next": "ch8_appeal_honor"
      },
      {
        "text": "Prepare the royal decree at the palace gates",
        "next": "ch8_palace_decree"
      }
    ]
  },
  {
    "id": "ch9_holding_emperor",
    "chapter_id": 9,
    "title": "Ch 9: Rescuing the Emperor",
    "dialogue": "Emperor Xian wanders hungry near Luoyang. Cao Cao arrives with warm food, silk robes, and a royal escort to Xuchang.",
    "choices": [
      {
        "text": "Build farming colonies (Tuntian) to feed everyone",
        "next": "ch9_build_farms"
      },
      {
        "text": "Issue official imperial decrees to restore law",
        "next": "ch9_issue_decrees"
      }
    ]
  },
  {
    "id": "ch10_wandering_heroes",
    "chapter_id": 10,
    "title": "Ch 10: Heroism at Changban",
    "dialogue": "Cao Cao's cavalry approaches! 100,000 citizens refuse to leave Liu Bei. Zhao Yun rides out while Zhang Fei guards Changban Bridge alone.",
    "choices": [
      {
        "text": "Zhang Fei roars across the wooden bridge",
        "next": "ch10_bridge_roar"
      },
      {
        "text": "Zhao Yun searches bravely to protect infant A'dou",
        "next": "ch10_zhao_yun_rescue"
      }
    ]
  },
  {
    "id": "ch11_guandu",
    "chapter_id": 11,
    "title": "Ch 11: Thunder Carts & Night Raid",
    "dialogue": "Yuan Shao's 100,000 troops build tall wooden arrow towers. Cao Cao's engineers roll out stone-throwing 'Thunder Carts'!",
    "choices": [
      {
        "text": "Launch a secret night raid on Wuchao grain depot",
        "next": "ch11_raid_wuchao"
      },
      {
        "text": "Fire stone catapults at the siege towers",
        "next": "ch11_thunder_carts"
      }
    ]
  },
  {
    "id": "ch12_thatch_hut",
    "chapter_id": 12,
    "title": "Ch 12: Three Visits in the Snow",
    "dialogue": "Snowflakes cover Longzhong. Zhuge Liang is napping peacefully inside his cottage. Liu Bei stands quietly in the cold courtyard.",
    "choices": [
      {
        "text": "Wait patiently until Zhuge Liang wakes up",
        "next": "ch12_patient_wait"
      },
      {
        "text": "Leave a polite handwritten note expressing your hope",
        "next": "ch12_leave_note"
      }
    ]
  },
  {
    "id": "ch13_bowan_slope",
    "chapter_id": 13,
    "title": "Ch 13: Zhuge Liang's First Battle",
    "dialogue": "Generals Guan Yu and Zhang Fei doubt 27-year-old Zhuge Liang. Xiahou Dun's 100,000 troops march into narrow Bowan Slope!",
    "choices": [
      {
        "text": "Zhao Yun feigns retreat into the dry reed pass",
        "next": "ch13_feign_retreat"
      },
      {
        "text": "Signal Guan Yu to light the fire arrows",
        "next": "ch13_light_fire"
      }
    ]
  },
  {
    "id": "ch14_red_cliffs",
    "chapter_id": 14,
    "title": "Ch 14: Battle of Red Cliffs",
    "dialogue": "Cao Cao's warships are locked together with iron chains on the Yangtze River. The southeast wind begins to blow strongly!",
    "choices": [
      {
        "text": "Send Huang Gai's straw fire-ships with the wind",
        "next": "ch14_send_fireships"
      },
      {
        "text": "Use straw boats in the morning fog to borrow arrows",
        "next": "ch14_straw_boats"
      }
    ]
  },
  {
    "id": "ch15_three_kingdoms",
    "chapter_id": 15,
    "title": "Ch 15: Formation of Three Kingdoms",
    "dialogue": "China splits into three distinct kingdoms: Wei in the North, Shu Han in the West, and Wu in the East. Peace returns to the cities.",
    "choices": [
      {
        "text": "Build schools and trade roads in Shu Han",
        "next": "ch15_build_shu"
      },
      {
        "text": "Form a lasting trade alliance between Shu and Wu",
        "next": "ch15_shu_wu_trade"
      }
    ]
  },
  {
    "id": "ch16_southern_northern_campaigns",
    "chapter_id": 16,
    "title": "Ch 16: The Southern Campaign & Northern Expeditions",
    "dialogue": "After Liu Bei's death, Zhuge Liang must secure Shu's southern border before facing Wei in the north. He wants lasting peace, not endless fighting.",
    "choices": [
      {
        "text": "Win Meng Huo's trust through patience and mercy",
        "next": "ch16_win_trust"
      },
      {
        "text": "Improve mountain supply routes with wooden transport carts",
        "next": "ch16_improve_supplies"
      }
    ]
  },
  {
    "id": "ch17_reunification",
    "chapter_id": 17,
    "title": "Ch 17: The Fall of the Three Kingdoms & Reunification",
    "dialogue": "The three kingdoms are weakening after decades of struggle. Leaders must decide how to protect their people as the Jin Dynasty rises.",
    "choices": [
      {
        "text": "Strengthen Jiange Pass and evacuate nearby families",
        "next": "ch17_protect_jiange"
      },
      {
        "text": "Offer fair surrender terms to reduce further suffering",
        "next": "ch17_fair_terms"
      }
    ]
  }
];
