import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react';
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

  const navigateRef = useRef<ReturnType<typeof useNavigate>>();

  // ✅ Navigation 컴포넌트로 navigate 인스턴스를 안전하게 저장
  const NavigationBridge = () => {
    navigateRef.current = useNavigate();
    return null;
  };

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
      logout(); // ⚠️ 실패 시 자동 로그아웃
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // 로그인
  const login = async (token: string) => {
    localStorage.setItem('token', token);
    await fetchUserData();
  };

  // 게임 후 보유 금액만 업데이트
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

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    setMoney(null);
    navigateRef.current?.('/auth/login'); // ✅ React 방식의 리다이렉션
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
      <NavigationBridge />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
