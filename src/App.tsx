/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Swords, 
  ChefHat, 
  Trophy, 
  UtensilsCrossed, 
  Sparkles, 
  Award, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Leaf,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerStats } from './types';
import { sounds } from './utils/sound';
import { GameHUD } from './components/GameHUD';
import { MonsterRaidScanner } from './components/MonsterRaidScanner';
import { NutriTycoonMode } from './components/NutriTycoonMode';
import { MenuBattleArena } from './components/MenuBattleArena';
import { GuildLeaderboard } from './components/GuildLeaderboard';
import { EcoShopModal } from './components/EcoShopModal';

// Generated Asset Paths
const MONSTER_IMG = '/src/assets/images/game_waste_monster_1794033687444.jpg';
const AVATAR_IMG = '/src/assets/images/game_hero_avatar_1794033688246.jpg';
const ARENA_BG_IMG = '/src/assets/images/game_cafeteria_arena_1794033689189.jpg';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'raid' | 'tycoon' | 'arena' | 'guild'>('raid');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [shopInitialTab, setShopInitialTab] = useState<'shop' | 'badges'>('shop');

  // Player RPG Stats
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    name: '에코 헌터',
    title: '잔반 슬레이어',
    level: 12,
    exp: 1450,
    maxExp: 2000,
    ecoGold: 1450,
    streakDays: 7,
    spoons: 5,
    maxSpoons: 5,
    totalCo2Saved: 12.4
  });

  // Sound FX Toggle
  const handleToggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setSoundEnabled(sounds.enabled);
    if (sounds.enabled) sounds.playCoin();
  };

  // Reward Distributor (EXP, Gold, CO2)
  const handleAddRewards = (gold: number, exp: number, co2: number) => {
    setPlayerStats(prev => {
      let newExp = prev.exp + exp;
      let newLevel = prev.level;
      let newMaxExp = prev.maxExp;

      // Level Up Check
      if (newExp >= prev.maxExp) {
        newLevel += 1;
        newExp = newExp - prev.maxExp;
        newMaxExp = Math.round(prev.maxExp * 1.3);
        sounds.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.4 }
        });
      }

      return {
        ...prev,
        ecoGold: prev.ecoGold + gold,
        exp: newExp,
        level: newLevel,
        maxExp: newMaxExp,
        totalCo2Saved: prev.totalCo2Saved + co2
      };
    });
  };

  // Spend Gold in Shop
  const handleSpendGold = (amount: number): boolean => {
    if (playerStats.ecoGold < amount) return false;
    setPlayerStats(prev => ({ ...prev, ecoGold: prev.ecoGold - amount }));
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* GAME TOP HUD (Hero profile, level, currency, streak, sound) */}
      <GameHUD
        stats={playerStats}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenShop={() => { setShopInitialTab('shop'); setIsShopOpen(true); }}
        onOpenAchievements={() => { setShopInitialTab('badges'); setIsShopOpen(true); }}
        avatarImg={AVATAR_IMG}
      />

      {/* SUB-HEADER GAME WORLD SELECTOR TABS */}
      <nav aria-label="Game World Navigation" className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-[69px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
          <div className="flex items-center space-x-2">
            {/* Tab 1: Monster Raid */}
            <button
              onClick={() => { sounds.playClick(); setActiveTab('raid'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center space-x-2 transition ${
                activeTab === 'raid'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>잔반몬 레이드 & 식판 스캐너</span>
            </button>

            {/* Tab 2: Nutri Tycoon */}
            <button
              onClick={() => { sounds.playClick(); setActiveTab('tycoon'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center space-x-2 transition ${
                activeTab === 'tycoon'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>급식 수호 타이쿤 (영양사 AI)</span>
            </button>

            {/* Tab 3: Menu Battle */}
            <button
              onClick={() => { sounds.playClick(); setActiveTab('arena'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center space-x-2 transition ${
                activeTab === 'arena'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>식단 배틀 & 출석 퀘스트</span>
            </button>

            {/* Tab 4: Guild Tournament */}
            <button
              onClick={() => { sounds.playClick(); setActiveTab('guild'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center space-x-2 transition ${
                activeTab === 'guild'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>길드 랭킹 & 탄소 숲</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500 shrink-0">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>EcoEat Quest · 시즌 3</span>
          </div>

        </div>
      </nav>

      {/* MAIN GAME CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'raid' && (
          <MonsterRaidScanner
            onAddRewards={handleAddRewards}
            monsterImg={MONSTER_IMG}
          />
        )}

        {activeTab === 'tycoon' && (
          <NutriTycoonMode
            onAddRewards={handleAddRewards}
            arenaBgImg={ARENA_BG_IMG}
          />
        )}

        {activeTab === 'arena' && (
          <MenuBattleArena
            onAddRewards={handleAddRewards}
          />
        )}

        {activeTab === 'guild' && (
          <GuildLeaderboard
            totalCo2Saved={playerStats.totalCo2Saved}
          />
        )}
      </main>

      {/* REWARD SHOP & ACHIEVEMENTS MODAL */}
      <EcoShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        initialTab={shopInitialTab}
        ecoGold={playerStats.ecoGold}
        onSpendGold={handleSpendGold}
      />

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 EcoEat Quest. AI 급식 잔반 감축 & 에코 히어로 RPG 시스템</p>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
            <span>Vision AI 3.0 탑재</span>
            <span>·</span>
            <span>ESG 탄소 중립</span>
            <span>·</span>
            <span>급식소 데이터 연동 중</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
