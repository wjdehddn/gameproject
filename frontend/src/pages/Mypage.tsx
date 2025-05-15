import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { gameTypeMap, resultMap } from '../utils/labelMaps';

interface User {
  username: string;
  nickname: string;
  money: number;
}

interface GameLog {
  game: string;
  result: string;
  bet: number;
  earnings: number;
  createdAt: string;
}

const Mypage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [recentGames, setRecentGames] = useState<GameLog[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/user/mypage')
      .then(res => {
        setUserData(res.data.user);
        setRecentGames(res.data.recentGames);
      })
      .catch(() => {
        alert('사용자 정보를 불러오지 못했습니다.');
      });
  }, []);

  if (!userData) return <div className="text-center mt-10">로딩 중...</div>;

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-100 to-white p-6 flex justify-center items-start">
      <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl shadow-lg p-10 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">👤 마이페이지</h1>

        <div className="space-y-2 mb-6 text-lg text-gray-800">
          <p> <strong>아이디:</strong> {userData.username}</p>
          <p> <strong>닉네임:</strong> {userData.nickname}</p>
          <p> <strong>포인트:</strong> {userData.money.toLocaleString()}pt</p>
        </div>

        {userData.money === 0 && (
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                await axios.post('/user/refill', {}, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                alert('머니가 충전되었습니다!');
                window.location.reload();
              } catch (err: any) {
                alert(err.response?.data?.message || '충전 실패');
              }
            }}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow-md w-full mb-4"
          >
            💸 포인트 리필 받기
          </button>
        )}

        <button
          onClick={() => navigate('/mypage/ProfileSettings')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full shadow-md mb-6"
        >
          ⚙️ 내 정보 관리
        </button>

        <div>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">🎮 최근 게임 전적</h2>
          {recentGames.length === 0 ? (
            <p className="text-gray-500">게임 기록이 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {recentGames.map((game, idx) => (
                <li key={idx} className="p-4 bg-gray-50 rounded-lg border shadow-sm">
                  <p><strong>게임:</strong> {gameTypeMap[game.game]}</p>
                  <p><strong>결과:</strong> {resultMap[game.result]}</p>
                  <p><strong>배팅:</strong> {game.bet}pt</p>
                  <p><strong>수익:</strong> {game.earnings}pt</p>
                  <p><strong>시간:</strong> {new Date(game.createdAt).toLocaleString('ko-KR')}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mypage;