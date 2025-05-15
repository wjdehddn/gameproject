import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 py-12">
      {/* 메인 소개 카드 */}
      <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-blue-200 max-w-4xl w-full mb-10">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">놀이터에 오신 것을 환영합니다!</h1>
        <p className="text-gray-700 text-lg">
          간단한 게임을 즐기고 포인트를 모아<br />
          순위 경쟁을 통해 실력을 뽐내보세요!
        </p>
      </div>

      {/* 기능 안내 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* 게임 선택 */}
        <div className="bg-white/70 backdrop-blur-md border border-blue-200 p-6 rounded-2xl shadow text-center">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">🎮 게임 선택</h2>
          <p className="text-gray-700 mb-4">
            가위바위보, 홀짝, 룰렛 등<br />
            다양한 미니게임을 플레이해보세요!
          </p>
          <Link
            to="/game"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            게임하러 가기 →
          </Link>
        </div>

        {/* 랭킹 보기 */}
        <div className="bg-white/70 backdrop-blur-md border border-blue-200 p-6 rounded-2xl shadow text-center">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">🏆 랭킹 보기</h2>
          <p className="text-gray-700 mb-4">
            다른 유저들과 경쟁하고<br />
            나의 순위를 확인해보세요!
          </p>
          <Link
            to="/ranking"
            className="inline-block px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            랭킹 보러 가기 →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;