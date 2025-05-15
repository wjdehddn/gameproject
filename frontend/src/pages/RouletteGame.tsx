import { useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const angleMap: Record<number, number> = {
  2: 150,
  3: 165,
  5: 60,
  10: 90,
  20: 315,
};

const RouletteGame = () => {
  const { updateMoney, money } = useAuth();
  const [bet, setBet] = useState('');
  const [selectedMultiplier, setSelectedMultiplier] = useState<number | null>(null);
  const [resultMultiplier, setResultMultiplier] = useState<number | null>(null);
  const [result, setResult] = useState('');
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const multipliers = [2, 3, 5, 10, 20];

  const spinRoulette = (targetAngle: number) => {
    setTransitionEnabled(false);
    setRotateDeg(0);
    setShowResult(false);
    setTimeout(() => {
      setTransitionEnabled(true);
      setRotateDeg(targetAngle);
    }, 50);
  };

  const handlePlay = async () => {
    const parsedBet = Number(bet);

    if (!bet || isNaN(parsedBet) || parsedBet <= 0) {
      alert('유효한 포인트를 입력해주세요.');
      return;
    }

    if (!selectedMultiplier) {
      alert('배수를 선택해주세요.');
      return;
    }

    if (money !== null && parsedBet > money) {
      alert('보유 포인트보다 많은 포인트를 배팅할 수 없습니다.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.post(
        '/game/roulette',
        { bet: parsedBet, selectedMultiplier },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      const angle = angleMap[data.resultMultiplier] ?? 0;
      const finalAngle = 360 * 5 + angle;

      spinRoulette(finalAngle);

      setTimeout(async () => {
        setResult(data.result);
        setResultMultiplier(data.resultMultiplier);
        setEarnings(data.gameLog.earnings);
        setShowResult(true);
        await updateMoney();
        setLoading(false);
      }, 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || '게임 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-100 to-white flex flex-col items-center justify-center px-4 py-10">
      {/* 상단 게임 선택 탭 */}
      <div className="w-full max-w-[37rem] flex justify-between gap-4 mb-6">
        <Link to="/game/rps" className="w-1/3 text-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded">
          가위바위보
        </Link>
        <Link to="/game/oddeven" className="w-1/3 text-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded">
          홀짝
        </Link>
        <Link to="/game/roulette" className="w-1/3 text-center bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded">
          룰렛
        </Link>
      </div>

      {/* 게임 박스 */}
      <div className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl shadow-lg p-6 w-full max-w-[37rem] flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">🎯 룰렛 게임</h2>

        {/* 배팅 입력 */}
        <input
          type="number"
          placeholder="배팅할 포인트 입력"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          className="border p-2 rounded w-full text-center mb-4"
        />

        {/* 배수 선택 */}
        <div className="flex flex-wrap gap-4 justify-center mb-4 w-full">
          {multipliers.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMultiplier(m)}
              className={`flex-1 py-2 rounded text-white font-semibold transition ${
                selectedMultiplier === m
                  ? 'bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {m}배
            </button>
          ))}
        </div>

        {/* 룰렛 이미지 */}
        <div className="relative w-64 h-64 mb-6">
          <div
            className={`w-full h-full ${transitionEnabled ? 'transition-transform duration-[3000ms] ease-out' : ''}`}
            style={{ transform: `rotate(${rotateDeg}deg)` }}
          >
            <img
              src="/images/roulette/roulette-wheel.png"
              alt="룰렛 이미지"
              className="w-full h-full object-contain mt-6"
            />
          </div>
          {/* 화살표 */}
          <div className="absolute top-[20px] left-1/2 -translate-x-1/2 -translate-y-full text-2xl">
            🔻
          </div>
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={handlePlay}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded transition-colors disabled:opacity-50 mb-4 mt-4"
        >
          {loading ? '돌리는 중...' : '룰렛 돌리기'}
        </button>

        {/* 결과 표시 */}
        {showResult && (
          <div className="bg-gray-100 w-full p-4 rounded shadow text-center space-y-2">
            <p>선택한 배수: <strong>{selectedMultiplier}배</strong></p>
            <p>룰렛 결과 배수: <strong>{resultMultiplier}배</strong></p>
            <p className="text-xl font-semibold text-green-700">
              {result === 'win' ? '🎉 승리!' : '😢 패배'}
            </p>
            <p>획득 포인트: 💰 <strong>{earnings.toLocaleString()}pt</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteGame;