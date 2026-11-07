import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Camera, 
  Award, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  PieChart, 
  Users, 
  Utensils, 
  CloudSun, 
  DollarSign, 
  ThumbsUp, 
  ThumbsDown, 
  BarChart3, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';

export default function App() {
  // Navigation & Core State
  const [mode, setMode] = useState('user'); // 'user' | 'admin'
  const [ecoPoints, setEcoPoints] = useState(1450);
  const [mealAttendance, setMealAttendance] = useState(true); // true: 식사함, false: 결식/외식
  
  // User Mode States
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'result'
  const [scannedResult, setScannedResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [votedMenus, setVotedMenus] = useState({});

  // Admin Mode States
  const [weatherCondition, setWeatherCondition] = useState('rainy');
  const [predictedWaste, setPredictedWaste] = useState(14.2);
  const [recommendedRice, setRecommendedRice] = useState(38); // kg

  // Sample Data: Sample Food Plates for AI Scan Simulator
  const samplePlates = [
    { id: 1, name: '완벽 잔반 제로 (Clean Plate)', wastePercent: 0, points: 100, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', comment: '완벽합니다! 잔반율 0%로 +100P 적립' },
    { id: 2, name: '약간의 국물 남음 (Slight Waste)', wastePercent: 8, points: 50, img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80', comment: '훌륭해요! 잔반율 8%로 +50P 적립' },
    { id: 3, name: '잔반 과다 배출 (High Waste)', wastePercent: 35, points: 0, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', comment: '다음엔 조금 더 남기지 마세요! (0P)' }
  ];

  // Menu Items for Voting
  const [tomorrowMenus, setTomorrowMenus] = useState([
    { id: 'm1', name: '수제 돈가스 & 바삭 튀김', likes: 142, dislikes: 12 },
    { id: 'm2', name: '해물 순두부찌개 & 계란말이', likes: 98, dislikes: 19 },
    { id: 'm3', name: '우삼겹 마라탕 & 꿔바로우', likes: 210, dislikes: 35 }
  ]);

  // Handle AI Scan Action
  const handleScanPlate = (plate) => {
    setSelectedImage(plate.img);
    setScanState('scanning');
    
    setTimeout(() => {
      setScannedResult(plate);
      setScanState('result');
      if (plate.points > 0) {
        setEcoPoints(prev => prev + plate.points);
      }
    }, 2000);
  };

  const handleResetScan = () => {
    setScanState('idle');
    setScannedResult(null);
    setSelectedImage(null);
  };

  // Handle Voting
  const handleVote = (id, type) => {
    if (votedMenus[id]) return; // prevent duplicate vote
    setTomorrowMenus(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likes: type === 'like' ? item.likes + 1 : item.likes,
          dislikes: type === 'dislike' ? item.dislikes + 1 : item.dislikes
        };
      }
      return item;
    }));
    setVotedMenus(prev => ({ ...prev, [id]: type }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white pb-12">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/40 text-emerald-400">
              <Leaf className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  EcoEat
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                  v2.4 Live
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">잔반 줄이기 & 급식잔반 AI 예측 시스템</p>
            </div>
          </div>

          {/* Mode Switcher & Points */}
          <div className="flex items-center space-x-3">
            
            {/* Eco Points Display */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-full px-3.5 py-1.5 flex items-center space-x-2 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">에코 포인트:</span>
              <span className="text-sm font-bold text-amber-400">{ecoPoints.toLocaleString()} P</span>
            </div>

            {/* View Mode Toggle */}
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700/80 flex items-center">
              <button
                onClick={() => setMode('user')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                  mode === 'user'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>피식자 모드</span>
              </button>
              <button
                onClick={() => setMode('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                  mode === 'admin'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>영양사 모드</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* MODE 1: USER / STUDENT / EMPLOYEE VIEW */}
        {mode === 'user' && (
          <div className="space-y-6">
            
            {/* Top Banner: Meal Opt-In Status & Carbon Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Today's Meal Opt-In Switch */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">오늘의 급식 신선도</span>
                    <span className="text-xs text-slate-400">12:00 ~ 13:30 식사</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">오늘 식사 참여 여부</h3>
                  <p className="text-xs text-slate-400 mb-4">정확한 잔반 및 수요 예측을 위해 사전 식사 여부를 선택해주세요.</p>
                </div>

                <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/80 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMealAttendance(true)}
                    className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      mealAttendance 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${mealAttendance ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>오늘 식사함</span>
                  </button>
                  <button
                    onClick={() => setMealAttendance(false)}
                    className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      !mealAttendance 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <XCircle className={`w-4 h-4 ${!mealAttendance ? 'text-rose-400' : 'text-slate-500'}`} />
                    <span>외식 / 결식</span>
                  </button>
                </div>
              </div>

              {/* Today's Menu Preview */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-teal-400">TODAY MENU</span>
                    <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">850 kcal</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">오늘의 중식 메뉴</h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>기장밥 & 쇠고기 미역국</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span className="font-semibold text-emerald-300">매콤 제육볶음 (메인)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>모둠 쌈채소 & 쌈장</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>배추김치 & 샤인머스캣 3알</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>알레르기 정보: 돼지고기, 대두, 밀 포함</span>
                </div>
              </div>

              {/* User Impact Summary */}
              <div className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 border border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">나의 친환경 기여도</span>
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                
                <div className="my-2">
                  <div className="text-3xl font-extrabold text-white mb-1">
                    12.4 <span className="text-sm font-normal text-slate-400">kg CO₂e 절감</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    이번 달 식판 비우기를 통해 소나무 <span className="text-emerald-400 font-bold">2.8그루</span>를 심은 효과를 냈습니다!
                  </p>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">다음 뱃지: 잔반 제로 히어로</span>
                    <span className="text-emerald-400 font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-slate-700/60 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full w-[85%]"></div>
                  </div>
                </div>
              </div>

            </div>

            {/* AI Food Waste Scanner Section (Core Interactive Simulator) */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-700/80">
                <div>
                  <div className="flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl font-bold text-white">AI 잔반 제로 실시간 스캐너</h2>
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Vision AI 3.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">식사 후 식판을 카메라로 스캔하면 AI가 잔반율을 측정하여 에코 포인트를 드립니다.</p>
                </div>
                {scanState === 'result' && (
                  <button
                    onClick={handleResetScan}
                    className="mt-3 md:mt-0 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>다시 스캔하기</span>
                  </button>
                )}
              </div>

              {/* Scanner Interactive Container */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* Left: Interactive Plate Selector & Viewport */}
                <div>
                  {scanState === 'idle' && (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-slate-400">테스트용 식판 이미지를 선택하여 스캔을 진행해보세요:</p>
                      <div className="grid grid-cols-3 gap-3">
                        {samplePlates.map((plate) => (
                          <div
                            key={plate.id}
                            onClick={() => handleScanPlate(plate)}
                            className="group cursor-pointer bg-slate-900 rounded-xl p-2 border border-slate-700 hover:border-emerald-500/80 transition-all hover:scale-105"
                          >
                            <div className="aspect-square rounded-lg overflow-hidden mb-2 relative">
                              <img src={plate.img} alt={plate.name} className="w-full h-full object-cover group-hover:opacity-90 transition" />
                              <span className="absolute bottom-1 right-1 bg-slate-900/90 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                {plate.wastePercent}% 잔반
                              </span>
                            </div>
                            <p className="text-xs text-center font-medium text-slate-300 truncate">{plate.name}</p>
                          </div>
                        ))}
                      </div>

                      {/* Dropzone mockup */}
                      <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center hover:border-emerald-500/50 transition cursor-pointer bg-slate-900/40">
                        <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-300">내 식판 촬영 또는 이미지 업로드</p>
                        <p className="text-xs text-slate-500 mt-1">모바일 카메라 지원 / JPG, PNG</p>
                      </div>
                    </div>
                  )}

                  {scanState === 'scanning' && (
                    <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-emerald-500/40 flex items-center justify-center">
                      <img src={selectedImage} alt="Scanning" className="w-full h-full object-cover opacity-60" />
                      
                      {/* Laser scanning overlay animation */}
                      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent animate-pulse" />
                      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-bounce" />

                      <div className="absolute bg-slate-900/90 border border-emerald-500/50 px-4 py-3 rounded-xl flex items-center space-x-3 shadow-2xl backdrop-blur-md">
                        <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                        <div>
                          <p className="text-xs font-bold text-white">AI 잔반 분석 진행 중...</p>
                          <p className="text-[10px] text-emerald-400">잔여 음식물 면적 계산 중 (88%)</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {scanState === 'result' && (
                    <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
                      <img src={selectedImage} alt="Scanned Result" className="w-full h-full object-cover" />
                      
                      {/* Bounding Boxes Simulation */}
                      <div className="absolute inset-4 border-2 border-emerald-400/80 rounded-lg pointer-events-none flex items-start justify-end p-2">
                        <span className="bg-emerald-500 text-slate-950 font-extrabold text-xs px-2 py-0.5 rounded shadow">
                          스캔 완료
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Scan Results & Reward Dashboard */}
                <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-700/70">
                  {scanState === 'idle' && (
                    <div className="text-center py-8">
                      <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-slate-300">식판 스캔 대기 중</h3>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                        좌측에서 샘플 이미지를 클릭하거나 식판 사진을 찍어 잔반 측정을 완료해보세요.
                      </p>
                    </div>
                  )}

                  {scanState === 'scanning' && (
                    <div className="text-center py-8 space-y-3">
                      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <h3 className="text-base font-bold text-white">음식물 비중 객체 탐지 중</h3>
                      <p className="text-xs text-slate-400">밥, 국, 반찬 잔여량을 실시간 세그멘테이션하고 있습니다.</p>
                    </div>
                  )}

                  {scanState === 'result' && scannedResult && (
                    <div className="space-y-5 animate-fade-in">
                      
                      {/* Score Badge */}
                      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                        <div>
                          <span className="text-xs font-semibold text-slate-400">AI 분석 결과</span>
                          <h3 className="text-xl font-extrabold text-white">{scannedResult.name}</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-emerald-400">{100 - scannedResult.wastePercent}점</span>
                          <p className="text-[10px] text-slate-400">클린 식판 점수</p>
                        </div>
                      </div>

                      {/* Waste Percentage Breakdown */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300">측정된 잔반율</span>
                          <span className={scannedResult.wastePercent === 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                            {scannedResult.wastePercent}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              scannedResult.wastePercent === 0 ? 'bg-emerald-400' : scannedResult.wastePercent < 15 ? 'bg-amber-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.max(scannedResult.wastePercent, 4)}%` }}
                          />
                        </div>
                      </div>

                      {/* AI Feedback & Reward Banner */}
                      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex items-start space-x-3">
                        <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-emerald-300">스마트 리워드 지급</h4>
                          <p className="text-xs text-slate-300 mt-0.5">{scannedResult.comment}</p>
                          {scannedResult.points > 0 && (
                            <div className="mt-2 inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>+{scannedResult.points} Eco Points 획득!</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="pt-2 flex space-x-3">
                        <button 
                          onClick={handleResetScan}
                          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition"
                        >
                          확인 및 완료
                        </button>
                      </div>

                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Bottom Grid: Tomorrow Menu Voting & Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Menu Voting Box */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <span>내일 식단 선호도 투표</span>
                      <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded">잔반 사전 방지</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">선호도를 투표하면 영양사님이 조리 수량을 미세 조절합니다.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {tomorrowMenus.map((menu) => {
                    const totalVotes = menu.likes + menu.dislikes;
                    const likePercent = totalVotes > 0 ? Math.round((menu.likes / totalVotes) * 100) : 50;
                    const userVoted = votedMenus[menu.id];

                    return (
                      <div key={menu.id} className="bg-slate-900/70 rounded-xl p-3.5 border border-slate-700/70 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-200">{menu.name}</span>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleVote(menu.id, 'like')}
                              disabled={!!userVoted}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 border transition ${
                                userVoted === 'like'
                                  ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300'
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-emerald-400'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{menu.likes}</span>
                            </button>
                            <button
                              onClick={() => handleVote(menu.id, 'dislike')}
                              disabled={!!userVoted}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 border transition ${
                                userVoted === 'dislike'
                                  ? 'bg-rose-500/30 border-rose-500 text-rose-300'
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400'
                              }`}
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                              <span>{menu.dislikes}</span>
                            </button>
                          </div>
                        </div>

                        {/* Vote ratio bar */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${likePercent}%` }} />
                          <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${100 - likePercent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Eco Leaderboard Widget */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>이달의 잔반 제로 챔피언십</span>
                  </h3>
                  <span className="text-xs text-slate-400">실시간 학급/부서 랭킹</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { rank: 1, name: '경영기획팀 (3반)', wasteAvg: '1.2%', points: '42,500 P', badge: '🥇' },
                    { rank: 2, name: 'SW개발팀 (1반)', wasteAvg: '2.8%', points: '38,100 P', badge: '🥈' },
                    { rank: 3, name: '디자인팀 (5반)', wasteAvg: '3.4%', points: '35,900 P', badge: '🥉' },
                    { rank: 4, name: '인사총무팀 (2반) [나의 부서]', wasteAvg: '4.1%', points: '31,200 P', isMe: true }
                  ].map((row) => (
                    <div 
                      key={row.rank}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition ${
                        row.isMe 
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-white' 
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 font-bold text-center text-slate-400">
                          {row.badge || `#${row.rank}`}
                        </span>
                        <span className={row.isMe ? 'font-bold text-emerald-300' : ''}>{row.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-400">평균 잔반율 <strong className="text-slate-200">{row.wasteAvg}</strong></span>
                        <span className="font-bold text-amber-400">{row.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* MODE 2: NUTRITIONIST / ADMIN VIEW */}
        {mode === 'admin' && (
          <div className="space-y-6">

            {/* AI Waste Prediction Control Center Top Bar */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl font-bold text-white">AI 급식 잔반 & 수요 예측 엔진</h2>
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      실시간 최적화 중
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    날씨, 과거 식수 데이터, 사용자 사전 식사 투표 결과를 결합하여 정확한 조리량을 추천합니다.
                  </p>
                </div>

                {/* Simulation Control Panel */}
                <div className="flex items-center space-x-3 bg-slate-900/90 p-2 rounded-xl border border-slate-700/80">
                  <div className="flex items-center space-x-2 px-2">
                    <CloudSun className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-300 font-semibold">가상 기상 조건:</span>
                  </div>
                  <select
                    value={weatherCondition}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWeatherCondition(val);
                      if (val === 'rainy') {
                        setPredictedWaste(14.2);
                        setRecommendedRice(38);
                      } else if (val === 'sunny') {
                        setPredictedWaste(8.5);
                        setRecommendedRice(45);
                      } else {
                        setPredictedWaste(19.8);
                        setRecommendedRice(32);
                      }
                    }}
                    className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="rainy">🌧️ 비 온 후 쌀쌀함 (외식 감소/식수↑)</option>
                    <option value="sunny">☀️ 화창함 (야외 활동/결식 약간↑)</option>
                    <option value="hot">🔥 폭염/시험 기간 (식수인원 급감)</option>
                  </select>
                </div>
              </div>

              {/* Realtime AI Prediction Key Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                
                {/* Metric 1 */}
                <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4">
                  <span className="text-xs text-slate-400 block mb-1">내일 예상 식수 인원</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-white">485</span>
                    <span className="text-xs font-semibold text-emerald-400">/ 520명 (93%)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">사전 참여 승인 410명 완료</p>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4">
                  <span className="text-xs text-slate-400 block mb-1">예상 잔반 배출량</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-amber-400">{predictedWaste}</span>
                    <span className="text-xs text-slate-400">kg</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-1">전월 대비 -34% 감소 예상</p>
                </div>

                {/* Metric 3 */}
                <div className="bg-slate-900/80 border border-emerald-500/40 rounded-xl p-4 bg-emerald-950/20">
                  <span className="text-xs text-emerald-400 font-semibold block mb-1">AI 쌀 권장 조리량</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-white">{recommendedRice}</span>
                    <span className="text-xs text-slate-400">kg</span>
                    <span className="text-xs text-slate-500 line-through">(기존 45kg)</span>
                  </div>
                  <p className="text-[11px] text-emerald-300 mt-1">🌾 7kg 쌀 절약 추천 (-15.5%)</p>
                </div>

                {/* Metric 4 */}
                <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4">
                  <span className="text-xs text-slate-400 block mb-1">이번 달 절감 식자재비</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-emerald-400">₩ 3,420,000</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">목표 달성률 114%</p>
                </div>

              </div>

            </div>

            {/* AI Menu Compatibility & Food Waste Risk Warning */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">AI 식단 조합 잔반 위험 알림</h3>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  잔반 고위험 조합 감지
                </span>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                    <span>주의 조합: [ 생선구이 ] + [ 시래기국 ]</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    과거 빅데이터 분석 결과, 해당 두 메뉴가 동시 편성될 경우 학생 잔반율이 평균 <strong className="text-amber-400">28.4% 상승</strong>했습니다.
                  </p>
                </div>
                <button className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold whitespace-nowrap transition shadow">
                  대체 메뉴(제육볶음) 변경 적용
                </button>
              </div>
            </div>

            {/* Charts & Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily Food Waste Trend (Visual CSS Bar Graph) */}
              <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">주간 잔반 배출량 추이 (kg)</h3>
                    <p className="text-xs text-slate-400">AI 도입 전 vs AI 잔반 예측 도입 후 비교</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-semibold">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 bg-slate-600 rounded-sm"></span>
                      <span className="text-slate-400">도입 전</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 bg-emerald-400 rounded-sm"></span>
                      <span className="text-emerald-400">도입 후 (EcoEat)</span>
                    </div>
                  </div>
                </div>

                {/* CSS Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-700">
                  {[
                    { day: '월', before: 65, after: 22 },
                    { day: '화', before: 58, after: 18 },
                    { day: '수', before: 82, after: 29 }, // 수요일 잔반 많음
                    { day: '목', before: 52, after: 15 },
                    { day: '금', before: 70, after: 20 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1.5 h-full">
                        {/* Before bar */}
                        <div 
                          className="w-1/3 bg-slate-600 rounded-t-md transition-all duration-500" 
                          style={{ height: `${(item.before / 90) * 100}%` }}
                          title={`도입 전: ${item.before}kg`}
                        />
                        {/* After bar */}
                        <div 
                          className="w-1/3 bg-emerald-400 rounded-t-md transition-all duration-500 relative group" 
                          style={{ height: `${(item.after / 90) * 100}%` }}
                        >
                          <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/40 transition">
                            {item.after}kg
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{item.day}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
                  <span>주간 총 배출량: <strong className="text-slate-200">104 kg</strong> (기존 327 kg)</span>
                  <span className="text-emerald-400 font-bold">총 68.2% 감축 성공 🎉</span>
                </div>
              </div>

              {/* Leftover Categories Breakdown */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">메뉴 종류별 잔반 비율</h3>
                  <p className="text-xs text-slate-400 mb-4">가장 많이 버려지는 식자재 유형</p>

                  <div className="space-y-4">
                    {[
                      { name: '국물류 (찌개/국)', percent: 45, color: 'bg-rose-500' },
                      { name: '나물 및 야채 반찬', percent: 30, color: 'bg-amber-400' },
                      { name: '주식 (밥/면)', percent: 15, color: 'bg-emerald-400' },
                      { name: '육류 및 단백질 메인', percent: 10, color: 'bg-teal-300' }
                    ].map((cat, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">{cat.name}</span>
                          <span className="text-slate-400 font-bold">{cat.percent}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                          <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${cat.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-3 bg-slate-900/70 rounded-xl border border-slate-700/70 text-xs text-slate-300 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p>국물 염도 조절 및 건더기 비중 미세 조정 시 잔반 18% 추가 감소가 기대됩니다.</p>
                </div>
              </div>

            </div>

            {/* Environmental & Carbon ESG Report Download */}
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">월간 ESG 탄소 중립 성과 리포트</h4>
                  <p className="text-xs text-slate-400">이번 달 총 1.4톤의 온실가스(CO₂) 배출을 저감하였습니다.</p>
                </div>
              </div>
              <button 
                onClick={() => alert("월간 ESG 보고서 PDF가 다운로드되었습니다.")}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl text-xs transition whitespace-nowrap"
              >
                리포트 PDF 다운로드
              </button>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 EcoEat Inc. Zero Waste School & Office Food Waste AI System.</p>
      </footer>
    </div>
  );
}