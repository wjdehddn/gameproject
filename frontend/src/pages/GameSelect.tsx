import { useNavigate } from 'react-router-dom';

const GameSelect = () => {
  const navigate = useNavigate();

  const handleGameClick = (path: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 이후 이용이 가능합니다.');
      navigate('/auth/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">🎮 게임을 선택하세요</h1>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => handleGameClick('/game/rps')}
          className="w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-md transition-colors"
        >
          ✊ 가위바위보
        </button>
        <button
          onClick={() => handleGameClick('/game/oddeven')}
          className="w-full py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-md transition-colors"
        >
          🎲 홀짝 주사위
        </button>
        <button
          onClick={() => handleGameClick('/game/roulette')}
          className="w-full py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-md transition-colors"
        >
          🎯 룰렛
        </button>
      </div>
    </div>
  );
};

export default GameSelect;