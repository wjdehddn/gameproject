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

  const navigateRef = useRef<ReturnType<typeof useNavigate> | null>(null);

  // ✅ NavigationBridge 내부 컴포넌트에서 navigate 초기화
  const NavigationBridge = () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigateRef.current = navigate;
    }, [navigate]);
    return null;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    setMoney(null);
    navigateRef.current?.('/auth/login');
  };

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
      console.log('📦 응답 데이터:', res.data);

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

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    await fetchUserData();
  };

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
