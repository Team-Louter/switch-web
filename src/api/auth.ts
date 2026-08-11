import instance from './axios';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupExtraRequest,
} from '@/types/auth';

// 이메일로 인증코드 발송
export const sendEmailCode = async (userEmail: string): Promise<void> => {
  await instance.get('/auth/email', { params: { userEmail } });
};

// 인증코드 검증
export const verifyEmailCode = async (
  userEmail: string,
  inputCode: string,
): Promise<void> => {
  await instance.get('/auth/verify', { params: { userEmail, inputCode } });
};

// 일반 회원가입
export const signup = async (body: SignupRequest): Promise<void> => {
  await instance.post('/auth/signup', body);
};

// Google 소셜 회원가입 추가 정보 등록
export const signupExtra = async (body: SignupExtraRequest): Promise<void> => {
  await instance.post('/auth/signup/extra', body);
};

// Google OAuth 인증 시작 — 현재 프런트 origin으로 콜백을 요청
export const startGoogleOAuth = (): void => {
  const callbackUrl = `${window.location.origin}/oauth/callback`;
  const baseUrl = (import.meta.env.VITE_BASE_URL as string).replace(/\/+$/, '');

  window.location.href =
    `${baseUrl}/auth/oauth/google/start` +
    `?redirect_uri=${encodeURIComponent(callbackUrl)}`;
};

// Google OAuth 일회용 코드를 로그인 토큰으로 교환
export const exchangeGoogleOAuthCode = async (
  code: string,
): Promise<LoginResponse> => {
  const response = await instance.post<LoginResponse>(
    '/auth/oauth/google/exchange',
    { code },
  );

  return response.data;
};

// 로그인
export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const response = await instance.post<LoginResponse>('/auth/login', body);
  return response.data;
};

// 로그아웃
export const logout = async (): Promise<void> => {
  await instance.post('/auth/logout');
};

// 토큰 갱신
export const refresh = async (): Promise<{ access_token: string }> => {
  const response = await instance.post<{ access_token: string }>(
    '/auth/refresh',
  );
  return response.data;
};

// 회원 탈퇴 이메일 인증코드 발송
export const sendWithdrawalEmailCode = async (): Promise<void> => {
  await instance.get('/me/withdrawal');
};

// 회원 탈퇴 인증코드 검증 및 탈퇴 처리
export const verifyWithdrawalEmailCode = async (
  inputCode: string,
): Promise<void> => {
  await instance.get('/me/withdrawal/verify', { params: { inputCode } });
};

// 아이디(이메일) 찾기
export const findEmail = async (
  studentId: number,
  userName: string,
): Promise<{ email: string }> => {
  const response = await instance.post<{ email: string }>('/auth/find-email', {
    studentId,
    userName,
  });
  return response.data;
};

// 비밀번호 재설정 인증코드(토큰) 발송
export const sendPasswordResetCode = async (
  userEmail: string,
): Promise<void> => {
  await instance.post('/auth/find-password', { userEmail });
};

// 비밀번호 재설정 (토큰 + 새 비밀번호)
export const resetPassword = async (
  token: string,
  newPassword: string,
  confirmPassword: string,
): Promise<void> => {
  await instance.post('/auth/reset-password', {
    token,
    newPassword,
    confirmPassword,
  });
};
