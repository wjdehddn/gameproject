import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userData, setUserData] = useState<{ username: string; nickname: string } | null>(null);

  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  useEffect(() => {
    axios.get('/user/mypage')
      .then(res => {
        const { username, nickname } = res.data.user;
        setUserData({ username, nickname });
        setNickname(nickname);
      });
  }, []);

  const checkNickname = async () => {
    try {
      const res = await axios.get(`/auth/check-nickname?nickname=${nickname}`);
      setNicknameAvailable(res.data.isAvailable);
    } catch {
      alert('닉네임 중복 확인 중 오류 발생');
    }
  };

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    const payload: {
      nickname?: string;
      oldPassword?: string;
      newPassword?: string;
    } = {};

    if (nickname !== userData?.nickname) payload.nickname = nickname;
    if (newPassword && currentPassword) {
      payload.oldPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      await axios.patch('/user/update', payload);
      alert('정보가 수정되었습니다.');
      navigate('/user/mypage');
    } catch (err: any) {
      alert(err.response?.data?.message || '정보 수정에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (!currentPassword) {
      setPasswordValid(null);
      return;
    }
    axios.post('/auth/verify-password', { password: currentPassword })
      .then(res => setPasswordValid(res.data.valid))
      .catch(() => setPasswordValid(false));
  }, [currentPassword]);

  useEffect(() => {
    if (!newPassword || !confirmPassword) {
      setPasswordMatch(null);
      return;
    }
    setPasswordMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-100 to-white p-6 flex justify-center items-start">
      <div className="w-full max-w-xl bg-white/80 border border-blue-200 backdrop-blur-md rounded-2xl shadow-md p-10">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">⚙️ 내 정보 관리</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">아이디</label>
          <input type="text" value={userData?.username || ''} readOnly className="border p-2 w-full bg-gray-100" />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">닉네임</label>
          <div className="flex">
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setNicknameAvailable(null);
              }}
              className="border p-2 flex-1 mr-2"
            />
            <button
              onClick={checkNickname}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              중복 확인
            </button>
          </div>
          {nicknameAvailable !== null && (
            <p className={`text-sm mt-1 ${nicknameAvailable ? 'text-green-500' : 'text-red-500'}`}>
              {nicknameAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border p-2 w-full"
          />
          {passwordValid !== null && (
            <p className={`text-sm mt-1 ${passwordValid ? 'text-green-500' : 'text-red-500'}`}>
              {passwordValid ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 w-full"
          />
          {passwordMatch !== null && (
            <p className={`text-sm mt-1 ${passwordMatch ? 'text-green-500' : 'text-red-500'}`}>
              {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            저장
          </button>
          <button
            onClick={() => navigate('/user/mypage')}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;