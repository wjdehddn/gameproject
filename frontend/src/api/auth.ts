import axios from './axios';

export const loginAPI = (data: { username: string; password: string }) =>
  axios.post('/auth/login', data);

export const checkUsernameAPI = (username: string) =>
  axios.get(`/auth/check-username`, { params: { username } });

export const checkNicknameAPI = (nickname: string) =>
  axios.get(`/auth/check-nickname`, { params: { nickname } });

export const signupAPI = (data: {
  username: string;
  password: string;
  nickname: string;
}) => axios.post('/auth/signup', data);

export const resetPasswordAPI = (data: {
  username: string;
  nickname: string;
  newPassword: string;
}) => axios.post('/auth/reset-password', data);