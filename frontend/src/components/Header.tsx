import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const { isLoggedIn, username, money, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-3xl font-extrabold text-blue-600">
        놀이터
      </Link>

      {/* 데스크탑 메뉴 */}
      <nav className="hidden sm:flex items-center gap-6">
        <Link to="/game" className="text-lg text-gray-700 hover:text-blue-500">게임</Link>
        <Link to="/ranking" className="text-lg text-gray-700 hover:text-blue-500">랭킹</Link>
        {isLoggedIn ? (
          <>
            <div className="text-right">
              <Link to="/user/mypage" className="font-bold text-gray-800 hover:underline">
                {username}님
              </Link>
              {money !== null && (
                <span className="block text-sm text-gray-600">
                  💰 {money.toLocaleString()}pt
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/auth/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              로그인
            </Link>
            <Link to="/auth/signup" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
              회원가입
            </Link>
          </>
        )}
      </nav>

      {/* 모바일 햄버거 메뉴 버튼 */}
      <div className="sm:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-700">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* 모바일 메뉴 슬라이드 */}
      <div
        className={`fixed top-[68px] right-0 w-full text-center bg-white shadow-lg z-50 transition-transform transform ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        } sm:hidden flex flex-col p-6 gap-4`}
      >
        <Link to="/game" onClick={() => setMenuOpen(false)} className="text-lg text-gray-700 hover:text-blue-500">게임</Link>
        <Link to="/ranking" onClick={() => setMenuOpen(false)} className="text-lg text-gray-700 hover:text-blue-500">랭킹</Link>
        {isLoggedIn ? (
          <>
            <Link to="/user/mypage" onClick={() => setMenuOpen(false)} className="font-bold text-gray-800 hover:underline">
              {username}님
            </Link>
            {money !== null && (
              <span className="text-sm text-gray-600 mb-2">
                💰 {money.toLocaleString()}pt
              </span>
            )}
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/auth/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center">
              로그인
            </Link>
            <Link to="/auth/signup" onClick={() => setMenuOpen(false)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-center">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;