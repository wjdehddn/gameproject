import { useState, useRef } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rpsChoiceMap, resultMap } from '../utils/labelMaps';

const choices = ['scissors', 'rock', 'paper'] as const; // 순서: 가위-바위-보
type Choice = typeof choices[number];

const RpsGame = () => {
  const { updateMoney, money } = useAuth();
  const [bet, setBet] = useState('');
  const [userChoice, setUserChoice] = useState<Choice | ''>('');
  const [result, setResult] = useState('');
  const [computerChoice, setComputerChoice] = useState<Choice | ''>('');
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animationChoice, setAnimationChoice] = useState<Choice>('rock');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = () => {
    let index = 0;
    intervalRef.current = setInterval(() => {
      setAnimationChoice(choices[index % 3]);
      index++;
    }, 100);
  };

  const stopAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handlePlay = async () => {
    const parsedBet = Number(bet);

    if (!bet || isNaN(parsedBet) || parsedBet <= 0) {
      alert('유효한 포인트를 입력해주세요.');
      return;
    }

    if (!userChoice) {
      alert('가위, 바위, 보 중 하나를 선택해주세요.');
      return;
    }

    if (money !== null && parsedBet > money) {
      alert('보유 포인트보다 많은 포인트를 배팅할 수 없습니다.');
      return;
    }

    try {
      setLoading(true);
      startAnimation();

      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/game/rps',
        { bet: parsedBet, userChoice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;

      setTimeout(() => {
        stopAnimation();
        setComputerChoice(data.computerChoice);
        setResult(data.result);
        setEarnings(data.gameLog.earnings);
        updateMoney();
        setAnimationChoice(data.computerChoice);
        setLoading(false);
      }, 2000);
    } catch (err: any) {
      stopAnimation();
      alert(err.response?.data?.message || '게임 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-100 to-white flex flex-col items-center justify-center px-4 py-10">
      {/* 네비게이션 바 */}
      <div className="w-full max-w-[37rem] flex justify-between gap-4 mb-6">
        <Link to="/game/rps" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded w-1/3 text-center">가위바위보</Link>
        <Link to="/game/oddeven" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded w-1/3 text-center">홀짝</Link>
        <Link to="/game/roulette" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded w-1/3 text-center">룰렛</Link>
      </div>

      {/* 게임 박스 */}
      <div className="bg-white/80 backdrop-blur-md border border-blue-200 shadow-xl rounded-2xl w-full max-w-[37rem] p-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">✊ 가위바위보 게임</h2>

        <input
          type="number"
          placeholder="배팅할 포인트 입력"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          className="p-2 border w-full text-center rounded mb-4"
        />

        <div className="flex justify-between w-full gap-4 mb-4">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => setUserChoice(choice)}
              disabled={loading}
              className={`flex-1 py-2 rounded font-semibold transition-colors text-white ${
                userChoice === choice
                  ? 'bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {choice === 'scissors' && '✌️ 가위'}
              {choice === 'rock' && '✊ 바위'}
              {choice === 'paper' && '✋ 보'}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <img
            src={`/images/rps/${animationChoice}.png`}
            alt="computer choice"
            className="w-64 h-64 object-contain"
          />
        </div>

        <button
          onClick={handlePlay}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded transition-colors disabled:opacity-50 mb-4 mt-4"
        >
          {loading ? '게임 중...' : '게임 시작'}
        </button>

        {result && (
          <div className="bg-gray-100 w-full p-4 rounded shadow text-center space-y-2">
            <p>당신의 선택: <strong>{rpsChoiceMap[userChoice]}</strong></p>
            <p>컴퓨터의 선택: <strong>{rpsChoiceMap[computerChoice]}</strong></p>
            <p className="text-xl font-semibold text-green-700">
              결과: {result === 'win' ? '🎉 ' : result === 'lose' ? '😢 ' : '🤝 '}
              {resultMap[result]}
            </p>
            <p>획득 포인트: 💰 {earnings.toLocaleString()}pt</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RpsGame;