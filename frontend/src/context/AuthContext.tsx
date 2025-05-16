import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  username: string | null;
  money: number | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateMoney: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [money, setMoney] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ 유저 정보 요청 함수
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('/user/mypage', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsername(res.data.user.username);
      setMoney(res.data.user.money);
    } catch (err) {
      console.error('❗ fetchUserData 실패:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // 🧠 로그인 (토큰 저장 후 유저 정보 요청)
  const login = async (token: string) => {
    localStorage.setItem('token', token);
    await fetchUserData();
  };

  // 🔄 게임 후 보유금액만 갱신
  const updateMoney = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get('/user/mypage', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMoney(res.data.user.money);
    } catch (err) {
      console.error('보유금액 업데이트 실패', err);
    }
  };

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    setMoney(null);
    navigate('/auth/login'); // ✅ React 방식의 리다이렉트
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        money,
        isLoggedIn: !!username,
        loading,
        login,
        logout,
        updateMoney,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
