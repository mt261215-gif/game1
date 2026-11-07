import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Flame, 
  Sparkles, 
  Utensils, 
  Trophy, 
  Heart 
} from 'lucide-react';
import { MenuItemVote } from '../types';
import { sounds } from '../utils/sound';

interface Props {
  onAddRewards: (gold: number, exp: number, co2: number) => void;
}

export const MenuBattleArena: React.FC<Props> = ({ onAddRewards }) => {
  const [mealAttendance, setMealAttendance] = useState<boolean>(true);
  const [attendanceClaimed, setAttendanceClaimed] = useState<boolean>(false);
  const [votedMenus, setVotedMenus] = useState<{ [key: string]: 'like' | 'dislike' }>({});

  const [tomorrowMenus, setTomorrowMenus] = useState<MenuItemVote[]>([
    { id: 'm1', name: '수제 치즈 돈가스 & 바삭 감자튀김', category: '양식/육류', calories: 880, likes: 142, dislikes: 12, comboPower: 95 },
    { id: 'm2', name: '해물 순두부찌개 & 포실 계란말이', category: '한식/찌개', calories: 620, likes: 98, dislikes: 19, comboPower: 82 },
    { id: 'm3', name: '우삼겹 마라탕 & 꿔바로우', category: '중식/스페셜', calories: 920, likes: 210, dislikes: 35, comboPower: 98 }
  ]);

  const handleClaimAttendance = (status: boolean) => {
    sounds.playCoin();
    setMealAttendance(status);
    if (!attendanceClaimed) {
      setAttendanceClaimed(true);
      onAddRewards(30, 50, 0.1);
    }
  };

  const handleVote = (id: string, type: 'like' | 'dislike') => {
    if (votedMenus[id]) return;
    sounds.playCoin();

    setTomorrowMenus(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          likes: type === 'like' ? m.likes + 1 : m.likes,
          dislikes: type === 'dislike' ? m.dislikes + 1 : m.dislikes
        };
      }
      return m;
    }));

    setVotedMenus(prev => ({ ...prev, [id]: type }));
    onAddRewards(20, 30, 0.05);
  };

  return (
    <div className="space-y-6">

      {/* TOP ROW: ATTENDANCE QUEST & TODAY'S MEAL CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quest 1: Meal Opt-In Attendance */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                일일 퀘스트: 사전 식수 예측
              </span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> +50 EXP
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1">오늘 급식 출석 체크</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              사전에 식사 여부를 등록하면 영양사 AI가 오늘 지을 밥의 양을 정확히 계산하여 음식물 낭비를 사전에 막습니다!
            </p>
          </div>

          <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleClaimAttendance(true)}
              className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                mealAttendance 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${mealAttendance ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>오늘 급식 참여함 🍽️</span>
            </button>
            <button
              onClick={() => handleClaimAttendance(false)}
              className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                !mealAttendance 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <XCircle className={`w-4 h-4 ${!mealAttendance ? 'text-rose-400' : 'text-slate-500'}`} />
              <span>외식 / 결식 예정</span>
            </button>
          </div>

          {attendanceClaimed && (
            <p className="text-[11px] text-emerald-400 text-center font-semibold mt-2.5">
              ✅ 사전 등록 완료! (+30 G, +50 EXP 획득)
            </p>
          )}
        </div>

        {/* Today's Meal Combat Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-teal-400">TODAY'S BATTLE MENU</span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                850 kcal
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-2.5">오늘의 중식 식단</h3>
            
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center justify-between bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
                <span className="flex items-center gap-2">
                  <span>🍚</span> 기장밥 & 쇠고기 미역국
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">+스테미나</span>
              </li>
              <li className="flex items-center justify-between bg-emerald-950/20 p-2 rounded-xl border border-emerald-500/30">
                <span className="flex items-center gap-2 font-bold text-emerald-300">
                  <span>🥩</span> 매콤 제육볶음 (메인 메인 파워)
                </span>
                <span className="text-[10px] text-amber-400 font-bold">+45 단백질</span>
              </li>
              <li className="flex items-center justify-between bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
                <span className="flex items-center gap-2">
                  <span>🥗</span> 모둠 쌈채소 & 쌈장
                </span>
                <span className="text-[10px] text-teal-400 font-bold">+식이섬유</span>
              </li>
              <li className="flex items-center justify-between bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
                <span className="flex items-center gap-2">
                  <span>🍇</span> 배추김치 & 샤인머스캣 3알
                </span>
                <span className="text-[10px] text-purple-400 font-bold">+비타민C</span>
              </li>
            </ul>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>알레르기: 돼지고기, 대두, 밀 포함</span>
            <span className="text-emerald-400 font-semibold">신선도 SSS급</span>
          </div>
        </div>

      </div>

      {/* TOMORROW MENU BATTLE TOURNAMENT */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="font-game text-lg text-white">
                내일 식단 배틀 토너먼트 (Tomorrow's Menu Arena)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              학생들이 가장 먹고 싶은 메뉴에 투표하세요! 영양사님이 1위 메뉴의 조리 비중을 늘려 잔반을 방지합니다.
            </p>
          </div>
          <span className="text-[11px] text-amber-400 font-bold bg-amber-950/80 border border-amber-500/30 px-2.5 py-1 rounded-xl self-start sm:self-auto">
            투표 시 +20 G · +30 EXP 획득
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {tomorrowMenus.map((menu, index) => {
            const total = menu.likes + menu.dislikes;
            const likePct = total > 0 ? Math.round((menu.likes / total) * 100) : 50;
            const userVote = votedMenus[menu.id];

            return (
              <div 
                key={menu.id}
                className="bg-slate-950 rounded-2xl p-4 border border-slate-800 hover:border-emerald-500/60 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-teal-400">{menu.category}</span>
                    <span className="text-[10px] font-mono text-slate-400">{menu.calories} kcal</span>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-white leading-snug">{menu.name}</h4>
                    {index === 0 && (
                      <span className="text-xs ml-1" title="현재 1위">🥇</span>
                    )}
                  </div>

                  {/* Battle Energy Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] mb-1 font-semibold">
                      <span className="text-emerald-400">선호도 {likePct}%</span>
                      <span className="text-slate-400 font-mono">{total}표</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${likePct}%` }} />
                      <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${100 - likePct}%` }} />
                    </div>
                  </div>
                </div>

                {/* Vote Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleVote(menu.id, 'like')}
                    disabled={!!userVote}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition border ${
                      userVote === 'like'
                        ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300'
                        : userVote
                        ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{menu.likes}</span>
                  </button>

                  <button
                    onClick={() => handleVote(menu.id, 'dislike')}
                    disabled={!!userVote}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition border ${
                      userVote === 'dislike'
                        ? 'bg-rose-500/30 border-rose-500 text-rose-300'
                        : userVote
                        ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-rose-400 hover:border-rose-500'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>{menu.dislikes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
