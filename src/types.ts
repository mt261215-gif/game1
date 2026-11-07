export interface PlayerStats {
  name: string;
  title: string;
  level: number;
  exp: number;
  maxExp: number;
  ecoGold: number;
  streakDays: number;
  spoons: number;
  maxSpoons: number;
  totalCo2Saved: number; // in kg
}

export interface PlateSample {
  id: number;
  name: string;
  wastePercent: number;
  damage: number;
  points: number;
  exp: number;
  img: string;
  comment: string;
  badge: string;
}

export interface MenuItemVote {
  id: string;
  name: string;
  category: string;
  calories: number;
  likes: number;
  dislikes: number;
  comboPower: number;
}

export interface GuildRanking {
  rank: number;
  name: string;
  dept: string;
  wasteAvg: string;
  points: number;
  tier: 'Master' | 'Diamond' | 'Platinum' | 'Gold';
  isMe?: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: string;
  purchased: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  progress: string;
}
