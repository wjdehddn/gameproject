import { useEffect, useState } from 'react';
import axios from 'axios';

interface RankingUser {
  id: number;
  nickname: string;
  money: number;
}

const Ranking = () => {
  const [rankingList, setRankingList] = useState<RankingUser[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);

useEffect(() => {
  const fetchRanking = async () => {
    try {
      const res = await axios.get('/ranking/board', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (Array.isArray(res.data.rankings)) {
        setRankingList(res.data.rankings);
      }
    } catch (err) {
      console.error('랭킹 목록 불러오기 실패', err);
    }
  };

  const fetchMyRank = async () => {
    try {
      const res = await axios.get('/ranking/my', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMyRank(res.data.rank);
    } catch (err) {
      console.error('내 랭킹 불러오기 실패', err);
    }
  };

  fetchRanking();

  // ✅ 로그인 상태일 때만 내 랭킹 요청
  const token = localStorage.getItem('token');
  if (token) {
    fetchMyRank();
  }
}, []);


  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 py-10">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">🏆 랭킹 보드</h1>

        {myRank !== null && (
          <div className="mb-4 text-center text-lg text-blue-800 font-semibold">
            나의 현재 랭킹: <span className="text-blue-600">{myRank}위</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-blue-800 text-center font-semibold">
                <th className="px-4 py-2 border">순위</th>
                <th className="px-4 py-2 border">닉네임</th>
                <th className="px-4 py-2 border">보유 포인트</th>
              </tr>
            </thead>
            <tbody>
              {rankingList.length > 0 ? (
                rankingList.map((user, index) => (
                  <tr
                    key={user.id}
                    className="text-center hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{user.nickname}</td>
                    <td className="px-4 py-2 border">{user.money.toLocaleString()}pt</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    랭킹 정보를 불러오는 중입니다...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
