import React, { useState } from 'react';
import { X, ShoppingBag, Award, Sparkles, Check, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ShopItem, AchievementBadge } from '../types';
import { sounds } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'shop' | 'badges';
  ecoGold: number;
  onSpendGold: (amount: number) => boolean;
}

export const EcoShopModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = 'shop',
  ecoGold,
  onSpendGold
}) => {
  const [tab, setTab] = useState<'shop' | 'badges'>(initialTab);

  const [shopItems, setShopItems] = useState<ShopItem[]>([
    {
      id: 'item-1',
      name: '급식 하이패스 1회권',
      cost: 800,
      description: '줄 서지 않고 가장 먼저 배식대로 직행하는 학생 최고의 특권!',
      icon: '🎟️',
      purchased: false
    },
    {
      id: 'item-2',
      name: '매점 아이스크림 1개 교환권',
      cost: 500,
      description: '시원한 매점 인기 아이스크림 무료 교환 쿠폰',
      icon: '🍦',
      purchased: false
    },
    {
      id: 'item-3',
      name: '인기 반찬 더블 리필권',
      cost: 300,
      description: '제육볶음이나 치킨가스를 1번 더 듬뿍 리필할 수 있는 쿠폰',
      icon: '🍱',
      purchased: true
    },
    {
      id: 'item-4',
      name: '친환경 대나무 텀블러',
      cost: 1500,
      description: '학교에서 실물 수령 가능한 각인형 프리미엄 에코 텀블러',
      icon: '🌿',
      purchased: false
    },
    {
      id: 'item-5',
      name: '황금 스푼 & 포크 아바타 칭호',
      cost: 1200,
      description: '게임 프로필에 번쩍이는 황금 이펙트가 장착됩니다.',
      icon: '👑',
      purchased: false
    }
  ]);

  const [badges] = useState<AchievementBadge[]>([
    {
      id: 'b1',
      title: '잔반 제로 퍼펙트',
      desc: '잔반 0% 클린 식판 5회 달성',
      icon: '🥇',
      unlocked: true,
      progress: '5 / 5 완료'
    },
    {
      id: 'b2',
      title: '신속한 에코 식사자',
      desc: '식사 시작 15분 이내 완식 후 스캔 완료',
      icon: '⚡',
      unlocked: true,
      progress: '완료'
    },
    {
      id: 'b3',
      title: '소나무 수호자',
      desc: '탄소 배출 저감 10kg CO₂e 돌파',
      icon: '🌲',
      unlocked: true,
      progress: '12.4kg 달성'
    },
    {
      id: 'b4',
      title: '백발백중 예언자',
      desc: '식수 인원 예측 오차 3% 이내 달성',
      icon: '🔮',
      unlocked: false,
      progress: '2 / 3 회 진행 중'
    },
    {
      id: 'b5',
      title: '잔반 슬레이어 마스터',
      desc: '보스 잔반몬 5회 K.O. 격퇴',
      icon: '⚔️',
      unlocked: false,
      progress: '3 / 5 마리 격퇴'
    }
  ]);

  if (!isOpen) return null;

  const handleBuy = (item: ShopItem) => {
    if (item.purchased) return;
    if (ecoGold < item.cost) {
      sounds.playHit();
      alert('에코 골드가 부족합니다! 식판을 비워 포인트를 모아보세요.');
      return;
    }

    const success = onSpendGold(item.cost);
    if (success) {
      sounds.playVictory();
      confetti({ particleCount: 50, spread: 60 });
      setShopItems(prev => prev.map(i => i.id === item.id ? { ...i, purchased: true } : i));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {tab === 'shop' ? <ShoppingBag className="w-5 h-5" /> : <Award className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-game text-lg text-white">
                {tab === 'shop' ? '에코 보물 상점 (Eco Shop)' : '명예의 전당 & 뱃지 도감'}
              </h3>
              <p className="text-xs text-slate-400">
                {tab === 'shop' ? '모은 에코 골드로 실생활 급식 특권을 구매하세요!' : '도전 과제를 클리어하여 특별 칭호를 해금하세요.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between bg-slate-950/60 border-b border-slate-800">
          <div className="flex space-x-2">
            <button
              onClick={() => { sounds.playClick(); setTab('shop'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                tab === 'shop'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>보물 상점</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setTab('badges'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                tab === 'badges'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>업적 뱃지</span>
            </button>
          </div>

          <div className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
            보유 골드: {ecoGold.toLocaleString()} G
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-3">
          
          {tab === 'shop' && (
            <div className="space-y-3">
              {shopItems.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 transition hover:border-slate-700"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800">
                      {item.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {item.name}
                        {item.purchased && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.2 rounded-full">
                            보유 중
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-mono text-xs font-black text-amber-400 mb-1.5">
                      {item.cost} G
                    </span>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={item.purchased || ecoGold < item.cost}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                        item.purchased 
                          ? 'bg-slate-800 text-slate-500 cursor-default'
                          : ecoGold < item.cost
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95'
                      }`}
                    >
                      {item.purchased ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>획득됨</span>
                        </>
                      ) : (
                        <span>구매하기</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map(b => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-start space-x-3 ${
                    b.unlocked 
                      ? 'bg-emerald-950/20 border-emerald-500/50' 
                      : 'bg-slate-950 border-slate-800 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className={`text-xs font-bold ${b.unlocked ? 'text-white' : 'text-slate-400'}`}>
                        {b.title}
                      </h4>
                      {!b.unlocked && <Lock className="w-3 h-3 text-slate-500" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{b.desc}</p>
                    <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                      {b.progress}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
