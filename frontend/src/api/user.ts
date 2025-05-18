import axios from './axios';

export const getUserInfoAPI = () =>
  axios.get('/user/mypage', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

export const getUserGamesAPI = () =>
  axios.get('/user/games', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

export const updateNicknameAPI = (nickname: string) =>
  axios.patch(
    '/user/nickname',
    { nickname },
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  );

export const updatePasswordAPI = (currentPassword: string, newPassword: string) =>
  axios.patch(
    '/user/password',
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  );

export const refillMoneyAPI = () =>
  axios.post(
    '/user/refill',
    {},
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  );