import React, { useState } from 'react';
import { 
  CloudSun, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown, 
  FileText, 
  Users, 
  Utensils, 
  ChefHat, 
  Sliders, 
  Play, 
  Award, 
  Flame 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';

interface Props {
  onAddRewards: (gold: number, exp: number, co2: number) => void;
  arenaBgImg: string;
}

export const NutriTycoonMode: React.FC<Props> = ({ onAddRewards, arenaBgImg }) => {
  // Weather & Simulation States
  const [weatherCondition, setWeatherCondition] = useState<'rainy' | 'sunny' | 'hot'>('rainy');
  const [riceAmount, setRiceAmount] = useState<number>(38); // kg
  const [sidePortion, setSidePortion] = useState<number>(100); // %
  const [isMenuSwapped, setIsMenuSwapped] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<{
    rank: 'S' | 'A' | 'B';
    wasteKg: number;
    diners: number;
    savedMoney: number;
    satisfaction: number;
  } | null>(null);

  // Dynamic calculations based on weather & player sliders
  const getExpectedDiners = () => {
    if (weatherCondition === 'rainy') return 485;
    if (weatherCondition === 'sunny') return 440;
    return 320;
  };

  const getIdealRice = () => {
    if (weatherCondition === 'rainy') return 38;
    if (weatherCondition === 'sunny') return 35;
    return 26;
  };

  // Run Simulation Event
  const handleRunSimulation = () => {
    sounds.playLaserScan();
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      const idealRice = getIdealRice();
      const diff = Math.abs(riceAmount - idealRice);
      const menuBonus = isMenuSwapped ? 0 : 5.4;

      let waste = Number((diff * 0.8 + 6.2 + menuBonus).toFixed(1));
      let diners = getExpectedDiners();
      let satisfaction = Math.min(100, Math.max(60, 96 - diff * 3 + (isMenuSwapped ? 10 : 0)));
      
      let rank: 'S' | 'A' | 'B' = 'B';
      if (diff <= 2 && isMenuSwapped) rank = 'S';
      else if (diff <= 4) rank = 'A';

      setSimResult({
        rank,
        wasteKg: waste,
        diners,
        savedMoney: 3420000 - Math.round(waste * 15000),
        satisfaction
      });

      if (rank === 'S') {
        sounds.playVictory();
        confetti({ particleCount: 70, spread: 60 });
        onAddRewards(200, 300, 1.2);
      } else {
        sounds.playCoin();
        onAddRewards(100, 150, 0.6);
      }
    }, 1500);
  };

  const handleSwapMenu = () => {
    sounds.playCoin();
    setIsMenuSwapped(true);
  };

  return (
    <div className="space-y-6">
      
      {/* TYCOON STAGE BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
          style={{ backgroundImage: `url(${arenaBgImg})` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <ChefHat className="w-5 h-5" />
              </div>
              <h2 className="font-game text-xl text-white tracking-wide">
                급식 수호 타이쿤: AI 수요 & 잔반 예측 시뮬레이터
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              날씨와 식단 위험도를 분석하고, 조리량을 미세 조정하여 잔반율 0%와 S-Rank를 달성하세요!
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-1.5 rounded-2xl">
            <CloudSun className="w-4 h-4 text-amber-400 ml-2" />
            <span className="text-xs text-slate-300 font-bold">기상 시뮬레이션:</span>
            <select
              value={weatherCondition}
              onChange={(e) => {
                sounds.playClick();
                const val = e.target.value as 'rainy' | 'sunny' | 'hot';
                setWeatherCondition(val);
                if (val === 'rainy') setRiceAmount(38);
                if (val === 'sunny') setRiceAmount(35);
                if (val === 'hot') setRiceAmount(26);
              }}
              className="bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-bold rounded-xl px-2.5 py-1 focus:outline-none"
            >
              <option value="rainy">🌧️ 비 온 후 쌀쌀함 (외식↓ / 식수 485명)</option>
              <option value="sunny">☀️ 화창한 봄날 (활동↑ / 식수 440명)</option>
              <option value="hot">🔥 폭염 및 축제 (외식↑ / 식수 320명)</option>
            </select>
          </div>
        </div>

        {/* Real-time KPI Cards */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block mb-1">내일 예상 식수 인원</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-mono text-2xl font-black text-white">{getExpectedDiners()}</span>
              <span className="text-xs font-bold text-emerald-400">명</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">사전 신청 94% 완료</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block mb-1">AI 권장 쌀 조리량</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-mono text-2xl font-black text-amber-400">{getIdealRice()}</span>
              <span className="text-xs text-slate-400">kg</span>
            </div>
            <p className="text-[11px] text-amber-400 mt-1">평시대비 절약 최적화</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block mb-1">예상 잔반 배출량</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-mono text-2xl font-black text-emerald-400">
                {isMenuSwapped ? '8.4' : '14.2'}
              </span>
              <span className="text-xs text-slate-400">kg</span>
            </div>
            <p className="text-[11px] text-emerald-300 mt-1">-68.2% 탄소 절감 달성</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block mb-1">절감 식자재 예산</span>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400">₩3,420,000</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">목표 달성률 114%</p>
          </div>
        </div>

      </div>

      {/* INTERACTIVE CHEF CONTROL DESK & DANGER COMBO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chef Tuning Slider Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">조리량 미세 세팅 & 시뮬레이션 개시</h3>
          </div>

          {/* Rice Amount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">밥솥 밥 짓는 양 (Rice Cooker)</span>
              <span className="font-mono text-emerald-400 font-bold">{riceAmount} kg</span>
            </div>
            <input 
              type="range"
              min="20"
              max="50"
              value={riceAmount}
              onChange={(e) => setRiceAmount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>최소 20kg</span>
              <span className="text-amber-400 font-bold">AI 추천: {getIdealRice()}kg</span>
              <span>최대 50kg</span>
            </div>
          </div>

          {/* Side Dish Portion Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">반찬 1인분 배식 배율 (Portion Ratio)</span>
              <span className="font-mono text-teal-300 font-bold">{sidePortion}%</span>
            </div>
            <input 
              type="range"
              min="80"
              max="120"
              value={sidePortion}
              onChange={(e) => setSidePortion(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>80% (소식)</span>
              <span>100% (표준)</span>
              <span>120% (풍족)</span>
            </div>
          </div>

          {/* Run Simulation Action Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition shadow-lg ${
              isSimulating 
                ? 'bg-slate-800 text-slate-400 cursor-wait' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 active:scale-98 shadow-emerald-500/20'
            }`}
          >
            {isSimulating ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>학생 급식 입장 & 잔반율 시뮬레이션 중...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>오늘의 급식 시뮬레이션 돌리기!</span>
              </>
            )}
          </button>

          {/* Simulation Output Card */}
          {simResult && (
            <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">경영 평가 랭크</span>
                  <span className="text-3xl font-game text-amber-400">{simResult.rank}-RANK 달성!</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white block">학생 만족도 {simResult.satisfaction}%</span>
                  <span className="text-xs text-emerald-400 font-mono">잔반 {simResult.wasteKg}kg 배출</span>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                {simResult.rank === 'S' 
                  ? '🎉 완벽합니다! AI 권장치와 위험 메뉴 교체를 모두 적용하여 잔반을 최소화했습니다!'
                  : '👍 양호한 조리 결과입니다! 권장 조리량을 맞추면 S-Rank를 획득할 수 있습니다.'}
              </p>
            </div>
          )}

        </div>

        {/* AI Dangerous Recipe Warning Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">AI 식단 조합 잔반 위험 레이더</h3>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  {isMenuSwapped ? '✨ 골든 식단 적용 완료!' : '⚠️ 주의 조합 감지: [생선구이] + [시래기국]'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {isMenuSwapped ? '잔반 위험 -85%' : '잔반 위험 +28.4%'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {isMenuSwapped 
                  ? '인기 메뉴 [수제 돈가스 & 우동]으로 대체 완료! 학생 식판 잔반율이 대폭 감소합니다.'
                  : '과거 3년간 빅데이터 분석 결과, 생선구이와 시래기국이 함께 배식된 날은 잔반이 28% 급증했습니다.'}
              </p>

              {!isMenuSwapped ? (
                <button
                  onClick={handleSwapMenu}
                  className="w-full mt-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow"
                >
                  황금 인기 메뉴(수제 돈가스)로 즉시 교체 (+35% 만족도)
                </button>
              ) : (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold pt-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>위험 메뉴가 성공적으로 교체되었습니다!</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Fact Box */}
          <div className="mt-4 p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>이번 달 온실가스 저감량: <strong className="text-white">1.4톤 CO₂</strong></span>
            <button
              onClick={() => {
                sounds.playCoin();
                alert('월간 ESG 탄소중립 리포트(PDF)가 다운로드되었습니다.');
              }}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ESG 리포트 다운</span>
            </button>
          </div>
        </div>

      </div>

      {/* ANALYTICS CHARTS (Weekly Trend & Dish Category Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trend Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">주간 급식 잔반 배출량 추이 (kg)</h3>
              <p className="text-xs text-slate-400">기존 운영 vs AI 타이쿤 도입 후 실측 데이터</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 bg-slate-600 rounded-xs inline-block" /> 기존
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-xs inline-block" /> EcoEat
              </span>
            </div>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-800">
            {[
              { day: '월', before: 65, after: 22 },
              { day: '화', before: 58, after: 18 },
              { day: '수', before: 82, after: 29 },
              { day: '목', before: 52, after: 15 },
              { day: '금', before: 70, after: 20 }
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-2 h-full">
                  <div 
                    className="w-1/3 bg-slate-700 rounded-t-md transition-all duration-500"
                    style={{ height: `${(d.before / 90) * 100}%` }}
                    title={`도입 전: ${d.before}kg`}
                  />
                  <div 
                    className="w-1/3 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-md transition-all duration-500 relative group"
                    style={{ height: `${(d.after / 90) * 100}%` }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-950 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/40">
                      {d.after}kg
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-bold">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between items-center text-xs text-slate-400">
            <span>주간 총 잔반: <strong className="text-slate-200">104 kg</strong> (기존 327 kg)</span>
            <span className="text-emerald-400 font-bold">총 68.2% 감축 완료 🎉</span>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">음식물 유형별 잔반 비중</h3>
            <p className="text-xs text-slate-400 mb-4">가장 주의해야 할 식자재 관리 항목</p>

            <div className="space-y-3.5">
              {[
                { name: '국물류 (찌개/탕)', pct: 45, color: 'bg-rose-500' },
                { name: '나물 및 야채류', pct: 30, color: 'bg-amber-400' },
                { name: '주식류 (밥/면)', pct: 15, color: 'bg-emerald-400' },
                { name: '육류 메인 요리', pct: 10, color: 'bg-teal-400' }
              ].map((c, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{c.name}</span>
                    <span className="text-slate-400 font-mono">{c.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div className={`${c.color} h-2 rounded-full`} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
            💡 국물 염도와 건더기 양을 미세 조절하면 국물 잔반 18%를 추가 감축할 수 있습니다.
          </p>
        </div>

      </div>

    </div>
  );
};
