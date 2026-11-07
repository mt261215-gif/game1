import React from 'react';
import { Sparkles, Flame, Volume2, VolumeX, ShoppingBag, Award, Zap } from 'lucide-react';
import { PlayerStats } from '../types';
import { sounds } from '../utils/sound';

interface Props {
  stats: PlayerStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
  avatarImg: string;
}

export const GameHUD: React.FC<Props> = ({
  stats,
  soundEnabled,
  onToggleSound,
  onOpenShop,
  onOpenAchievements,
  avatarImg
}) => {
  const expPercentage = Math.min(100, Math.round((stats.exp / stats.maxExp) * 100));

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Player Profile & Level */}
        <div className="flex items-center space-x-3">
          <div className="relative group cursor-pointer" onClick={() => { sounds.playClick(); onOpenAchievements(); }}>
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-400 bg-emerald-950/60 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition transform hover:scale-105">
              <img 
                src={avatarImg} 
                alt="Hero Avatar" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-md border border-slate-900 shadow">
              Lv.{stats.level}
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                {stats.name}
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                {stats.title}
              </span>
            </div>

            {/* EXP Bar */}
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-28 sm:w-36 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/80">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full transition-all duration-500"
                  style={{ width: `${expPercentage}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {stats.exp}/{stats.maxExp} EXP
              </span>
            </div>
          </div>
        </div>

        {/* Center: Streak & Energy Spoons */}
        <div className="hidden md:flex items-center space-x-4 bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-1.5">
          {/* Day Streak */}
          <div className="flex items-center space-x-1.5 text-xs">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
            <span className="text-slate-400 font-medium">연속 클린:</span>
            <span className="font-black text-amber-400">{stats.streakDays}일차 달성!</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Lunch Spoons (Energy) */}
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-slate-400 font-medium">에코 스푼:</span>
            <div className="flex space-x-0.5">
              {Array.from({ length: stats.maxSpoons }).map((_, i) => (
                <span 
                  key={i} 
                  className={`text-sm transition-transform ${i < stats.spoons ? 'opacity-100 scale-105' : 'opacity-25 grayscale'}`}
                >
                  🥄
                </span>
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Carbon Cut Counter */}
          <div className="flex items-center space-x-1 text-xs">
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-slate-400">탄소 절감:</span>
            <span className="font-bold text-teal-300">{stats.totalCo2Saved.toFixed(1)} kg</span>
          </div>
        </div>

        {/* Right: Currency, Sound & Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Eco Gold Display */}
          <div className="bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-1 flex items-center space-x-2 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs font-bold text-amber-300 tracking-wider">
              {stats.ecoGold.toLocaleString()} G
            </span>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              onToggleSound();
            }}
            title={soundEnabled ? '효과음 켜짐' : '효과음 음소거'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Achievements Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAchievements();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition"
            title="업적 & 뱃지 도감"
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Shop Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenShop();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>상점</span>
          </button>
        </div>

      </div>
    </header>
  );
};
