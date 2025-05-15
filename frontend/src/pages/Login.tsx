import { useState } from 'react';
import { loginAPI } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await loginAPI({ username, password });
      const token = res.data.token;
      await login(token);
      navigate('/');
    } catch (err) {
      alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="w-full max-w-md bg-white border border-blue-200 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">🎮 Game Login</h1>

        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 rounded border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 transition duration-200 py-2 px-4 rounded font-semibold text-white shadow-md"
        >
          로그인
        </button>

        <div className="flex justify-between text-sm mt-6 text-blue-600">
          <Link to="/auth/signup" className="hover:underline">
            회원가입
          </Link>
          <Link to="/auth/reset-password" className="hover:underline">
            비밀번호 재설정
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;