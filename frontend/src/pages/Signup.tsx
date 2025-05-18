import { useState } from 'react';
import { checkUsernameAPI, checkNicknameAPI, signupAPI } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });

  const [check, setCheck] = useState({
    username: false,
    nickname: false,
  });

  const [messages, setMessages] = useState({
    username: '',
    nickname: '',
    passwordMatch: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'username' || name === 'nickname') {
      setCheck((prev) => ({ ...prev, [name]: false }));
      setMessages((prev) => ({ ...prev, [name]: '' }));
    }

    if (name === 'password' || name === 'confirmPassword') {
      const pw = name === 'password' ? value : form.password;
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
    if (!form.username.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }

    const res = await checkUsernameAPI(form.username);
    setCheck((prev) => ({ ...prev, username: res.data.isAvailable }));
    setMessages((prev) => ({
      ...prev,
      username: res.data.isAvailable
        ? '✅ 사용할 수 있는 아이디입니다.'
        : '❌ 중복된 아이디입니다.',
    }));
  };

  const handleCheckNickname = async () => {
    if (!form.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    const res = await checkNicknameAPI(form.nickname);
    setCheck((prev) => ({ ...prev, nickname: res.data.isAvailable }));
    setMessages((prev) => ({
      ...prev,
      nickname: res.data.isAvailable
        ? '✅ 사용할 수 있는 닉네임입니다.'
        : '❌ 중복된 닉네임입니다.',
    }));
  };

  const handleSubmit = async () => {
    if (!check.username || !check.nickname) {
      alert('아이디/닉네임 중복확인을 해주세요.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await signupAPI({
        username: form.username,
        password: form.password,
        nickname: form.nickname,
      });
      alert('회원가입 성공!');
      navigate('/auth/login');
    } catch {
      alert('회원가입 실패');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-200 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">회원가입</h2>

        {/* 아이디 입력 */}
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
            중복확인
          </button>
        </div>
        {messages.username && (
          <p className="text-sm text-gray-600 mb-2">{messages.username}</p>
        )}

        {/* 닉네임 입력 */}
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
            중복확인
          </button>
        </div>
        {messages.nickname && (
          <p className="text-sm text-gray-600 mb-2">{messages.nickname}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full mb-2 text-gray-800"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full mb-2 text-gray-800"
        />
        {messages.passwordMatch && (
          <p className="text-sm text-gray-600 mb-3">{messages.passwordMatch}</p>
        )}

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600 transition"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Signup;