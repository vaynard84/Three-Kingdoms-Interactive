import heroImg from '../assets/images/hero_storybook_scene_1785995072159.jpg';
import scholarImg from '../assets/images/scholar_study_room_1785995086999.jpg';
import mapScrollImg from '../assets/images/three_kingdoms_map_scroll_1785995102275.jpg';

export interface AssetRegistry {
  heroScene: string;
  scholarStudy: string;
  mapScroll: string;
  factionBanners: Record<string, { bgGradient: string; border: string; text: string; emblem: string }>;
}

export const ASSETS: AssetRegistry = {
  heroScene: heroImg,
  scholarStudy: scholarImg,
  mapScroll: mapScrollImg,
  factionBanners: {
    Wei: {
      bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
      border: 'border-blue-500/60',
      text: 'text-blue-300',
      emblem: '魏'
    },
    Shu: {
      bgGradient: 'from-emerald-950 via-stone-900 to-green-950',
      border: 'border-emerald-500/60',
      text: 'text-emerald-300',
      emblem: '蜀'
    },
    Wu: {
      bgGradient: 'from-red-950 via-amber-950 to-rose-950',
      border: 'border-red-500/60',
      text: 'text-rose-300',
      emblem: '吳'
    },
    Han: {
      bgGradient: 'from-amber-950 via-stone-900 to-yellow-950',
      border: 'border-amber-500/60',
      text: 'text-amber-300',
      emblem: '漢'
    },
    Neutral: {
      bgGradient: 'from-stone-900 via-purple-950 to-stone-950',
      border: 'border-purple-500/60',
      text: 'text-purple-300',
      emblem: '群'
    }
  }
};
