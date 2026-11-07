import React, { useState } from 'react';
import { Trophy, Award, Flame, Users, Sparkles, Trees, Heart } from 'lucide-react';
import { GuildRanking } from '../types';
import { sounds } from '../utils/sound';

interface Props {
  totalCo2Saved: number;
}

export const GuildLeaderboard: React.FC<Props> = ({ totalCo2Saved }) => {
  const [guilds, setGuilds] = useState<GuildRanking[]>([
    { rank: 1, name: '3학년 3반 (경영기획 길드)', dept: '3학년', wasteAvg: '1.2%', points: 42500, tier: 'Master' },
    { rank: 2, name: '2학년 1반 (SW개발 길드)', dept: '2학년', wasteAvg: '2.8%', points: 38100, tier: 'Diamond' },
    { rank: 3, name: '1학년 5반 (디자인 길드)', dept: '1학년', wasteAvg: '3.4%', points: 35900, tier: 'Platinum' },
    { rank: 4, name: '2학년 2반 (인사총무 길드) [나의 길드]', dept: '2학년', wasteAvg: '4.1%', points: 31200, tier: 'Gold', isMe: true }
  ]);

  const [boosted, setBoosted] = useState(false);

  const handleBoostMyGuild = () => {
    if (boosted) return;
    sounds.playVictory();
    setBoosted(true);

    setGuilds(prev => prev.map(g => {
      if (g.isMe) {
        return {
          ...g,
          points: g.points + 250,
          wasteAvg: '3.9%'
        };
      }
      return g;
    }));
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Master': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Diamond': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Platinum': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default: return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  const treesPlanted = (totalCo2Saved / 4.4).toFixed(1);

  return (
    <div className="space-y-6">

      {/* TOP: CARBON TREE IMPACT CARD */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Trees className="w-6 h-6 text-emerald-400" />
              <h3 className="font-game text-xl text-white">나의 지구 정화 탄소 기여도</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-lg">
              식판 비우기 전투를 통해 <strong className="text-emerald-300">{totalCo2Saved.toFixed(1)} kg CO₂e</strong> 온실가스를 감축했습니다.
              이는 30년생 소나무 <span className="text-amber-400 font-black">{treesPlanted}그루</span>를 심은 것과 동일한 효과입니다!
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 min-w-[220px]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400">다음 타이틀: 잔반 제로 히어로</span>
              <span className="text-emerald-400 font-bold">85%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full w-[85%]" />
            </div>
            <span className="text-[10px] text-slate-500 block text-right mt-1">남은 경험치: 150 EXP</span>
          </div>
        </div>
      </div>

      {/* GUILD CHAMPIONSHIP BOARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="font-game text-lg text-white">
                학급/부서 잔반 제로 길드 챔피언십
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              월간 최저 잔반율을 달성한 1위 길드에게는 '전원 특별 디저트 & 에코 트로피'가 수여됩니다!
            </p>
          </div>

          <button
            onClick={handleBoostMyGuild}
            disabled={boosted}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 transition shadow ${
              boosted 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 active:scale-95'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${boosted ? '' : 'fill-slate-950'}`} />
            <span>{boosted ? '오늘의 길드 응원 완료 (+250P)' : '내 길드에 에코 부스터 발사!'}</span>
          </button>
        </div>

        {/* Guild Ranking List */}
        <div className="mt-4 space-y-3">
          {guilds.map(guild => (
            <div
              key={guild.rank}
              className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                guild.isMe
                  ? 'bg-emerald-950/40 border-emerald-500/70 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <span className={`w-8 h-8 rounded-xl font-game text-sm flex items-center justify-center font-black ${
                  guild.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30' :
                  guild.rank === 2 ? 'bg-slate-300 text-slate-950' :
                  guild.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  #{guild.rank}
                </span>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${guild.isMe ? 'text-emerald-300' : 'text-white'}`}>
                      {guild.name}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${getTierBadge(guild.tier)}`}>
                      {guild.tier}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    평균 잔반율 <strong className="text-slate-200 font-mono">{guild.wasteAvg}</strong> · 주간 클린 지수 우수
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-auto">
                <div className="text-right">
                  <span className="font-mono text-base font-black text-amber-400">
                    {guild.points.toLocaleString()} P
                  </span>
                  <span className="text-[10px] text-slate-400 block">길드 누적 포인트</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
