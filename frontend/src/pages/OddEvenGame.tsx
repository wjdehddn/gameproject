import { useState, useRef } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OddEvenGame = () => {
  const { updateMoney, money } = useAuth();
  const [bet, setBet] = useState('');
  const [choice, setChoice] = useState<'odd' | 'even' | ''>('');
  const [result, setResult] = useState('');
  const [rolling1, setRolling1] = useState(1);
  const [rolling2, setRolling2] = useState(1);
  const [sum, setSum] = useState<number | null>(null);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef1 = useRef<NodeJS.Timeout | null>(null);
  const intervalRef2 = useRef<NodeJS.Timeout | null>(null);

  const startRolling = () => {
    let i = 1;
    intervalRef1.current = setInterval(() => {
      setRolling1((i % 6) + 1);
      i++;
    }, 100);

    let j = 4;
    intervalRef2.current = setInterval(() => {
      setRolling2((j % 6) + 1);
      j++;
    }, 100);
  };

  const stopRolling = () => {
    if (intervalRef1.current) clearInterval(intervalRef1.current);
    if (intervalRef2.current) clearInterval(intervalRef2.current);
  };

  const handlePlay = async () => {
    const parsedBet = Number(bet);

    if (!bet || isNaN(parsedBet) || parsedBet <= 0) {
      alert('유효한 포인트를 입력해주세요.');
      return;
    }

    if (!choice) {
      alert('홀 또는 짝을 선택해주세요.');
      return;
    }

    if (money !== null && parsedBet > money) {
      alert('보유 포인트보다 많은 포인트를 배팅할 수 없습니다.');
      return;
    }

    try {
      setLoading(true);
      setResult('');
      setSum(null);
      setEarnings(0);
      startRolling();

      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/game/oddeven',
        { bet: parsedBet, choice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;

      setTimeout(() => {
        stopRolling();
        setRolling1(data.dice1);
        setRolling2(data.dice2);
        setSum(data.sum);
        setResult(data.result);
        setEarnings(data.gameLog.earnings);
        updateMoney();
        setLoading(false);
      }, 2000);
    } catch (err: any) {
      stopRolling();
      alert(err.response?.data?.message || '게임 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-100 to-white flex flex-col items-center justify-center px-4 py-10">
      {/* 게임 선택 탭 */}
      <div className="w-full max-w-[37rem] flex justify-between gap-4 mb-6">
        <Link to="/game/rps" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded w-1/3 text-center">
          가위바위보
        </Link>
        <Link to="/game/oddeven" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded w-1/3 text-center">
          홀짝
        </Link>
        <Link to="/game/roulette" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded w-1/3 text-center">
          룰렛
        </Link>
      </div>

      {/* 게임 박스 */}
      <div className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl shadow-lg p-6 w-full max-w-[37rem] flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">🎲 홀짝 게임</h2>

        {/* 배팅 입력 */}
        <input
          type="number"
          placeholder="배팅할 포인트 입력"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          className="border p-2 rounded w-full text-center mb-4"
        />

        {/* 선택 버튼 */}
        <div className="flex justify-between gap-4 w-full mb-4">
          <button
            onClick={() => setChoice('odd')}
            disabled={loading}
            className={`flex-1 py-2 rounded text-white font-semibold transition ${
              choice === 'odd' ? 'bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            홀
          </button>
          <button
            onClick={() => setChoice('even')}
            disabled={loading}
            className={`flex-1 py-2 rounded text-white font-semibold transition ${
              choice === 'even' ? 'bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            짝
          </button>
        </div>

        {/* 주사위 이미지 */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="w-[50%]">
            <img
              src={`/images/dice/dice-${rolling1}.png`}
              alt="주사위 1"
              className="w-full"
            />
          </div>
          <div className="w-[50%]">
            <img
              src={`/images/dice/dice-${rolling2}.png`}
              alt="주사위 2"
              className="w-full"
            />
          </div>
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={handlePlay}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded transition-colors disabled:opacity-50 mb-4 mt-4"
        >
          {loading ? '게임 중...' : '게임 시작'}
        </button>

        {/* 결과 표시 */}
        {result && (
          <div className="bg-gray-100 p-4 rounded shadow text-center w-full space-y-2">
            <p>내 선택: <strong>{choice === 'odd' ? '홀' : '짝'}</strong></p>
            <p>합계: <strong>{sum}</strong> → {sum! % 2 === 0 ? '짝수' : '홀수'}</p>
            <p className="text-xl font-semibold text-green-700">
              결과: {result === 'win' ? '🎉 승리' : '😢 패배'}
            </p>
            <p>획득 포인트: 💰 {earnings.toLocaleString()}pt</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OddEvenGame;