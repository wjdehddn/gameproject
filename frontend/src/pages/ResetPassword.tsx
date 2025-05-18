import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  resetPasswordAPI,
  checkUsernameAPI,
  checkNicknameAPI,
} from '../api/auth';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    nickname: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [messages, setMessages] = useState({
    username: '',
    nickname: '',
    passwordMatch: '',
  });

  const [validUsername, setValidUsername] = useState(false);
  const [validNickname, setValidNickname] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'newPassword' || name === 'confirmPassword') {
      const pw = name === 'newPassword' ? value : form.newPassword;
      const confirm = name === 'confirmPassword' ? value : form.confirmPassword;

      setMessages((prev) => ({
        ...prev,
        passwordMatch:
          pw && confirm
            ? pw === confirm
              ? '✅ 비밀번호가 일치합니다.'
              : '❌ 비밀번호가 일치하지 않습니다.'
            : '',
      }));
    }
  };

  const handleCheckUsername = async () => {
    try {
      const res = await checkUsernameAPI(form.username);
      const exists = !res.data.isAvailable;
      setValidUsername(exists);
      setMessages((prev) => ({
        ...prev,
        username: exists
          ? '✅ 존재하는 아이디입니다.'
          : '❌ 존재하지 않는 아이디입니다.',
      }));
    } catch {
      setMessages((prev) => ({
        ...prev,
        username: '❌ 아이디 확인 실패',
      }));
    }
  };

  const handleCheckNickname = async () => {
    try {
      const res = await checkNicknameAPI(form.nickname);
      const exists = !res.data.isAvailable;
      setValidNickname(exists);
      setMessages((prev) => ({
        ...prev,
        nickname: exists
          ? '✅ 존재하는 닉네임입니다.'
          : '❌ 존재하지 않는 닉네임입니다.',
      }));
    } catch {
      setMessages((prev) => ({
        ...prev,
        nickname: '❌ 닉네임 확인 실패',
      }));
    }
  };

  const handleReset = async () => {
    if (!validUsername) {
      alert('존재하는 아이디인지 먼저 확인해주세요.');
      return;
    }

    if (!validNickname) {
      alert('존재하는 닉네임인지 먼저 확인해주세요.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await resetPasswordAPI({
        username: form.username,
        nickname: form.nickname,
        newPassword: form.newPassword,
      });
      alert('비밀번호가 재설정되었습니다.');
      navigate('/auth/login');
    } catch {
      alert('아이디와 닉네임이 일치하지 않습니다.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-200 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">🔐 비밀번호 재설정</h2>

        <div className="flex gap-2 mb-2">
          <input
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full text-gray-800"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded whitespace-nowrap hover:bg-blue-600"
            onClick={handleCheckUsername}
          >
            확인
          </button>
        </div>
        {messages.username && (
          <p className="text-sm text-gray-600 mb-2">{messages.username}</p>
        )}

        <div className="flex gap-2 mb-2">
          <input
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full text-gray-800"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded whitespace-nowrap hover:bg-blue-600"
            onClick={handleCheckNickname}
          >
            확인
          </button>
        </div>
        {messages.nickname && (
          <p className="text-sm text-gray-600 mb-2">{messages.nickname}</p>
        )}

        <input
          type="password"
          name="newPassword"
          placeholder="새 비밀번호"
          value={form.newPassword}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full mb-2 text-gray-800"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full mb-2 text-gray-800"
        />
        {messages.passwordMatch && (
          <p className="text-sm text-gray-600 mb-3">{messages.passwordMatch}</p>
        )}

        <button
          onClick={handleReset}
          className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600 transition"
        >
          비밀번호 재설정
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;