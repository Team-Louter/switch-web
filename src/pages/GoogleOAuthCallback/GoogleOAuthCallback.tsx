import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeGoogleOAuthCode } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';

// 신규 code 콜백과 기존 token 콜백을 호환 처리
function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setToken = useAuthStore((s) => s.setToken);
  const setPendingToken = useAuthStore((s) => s.setPendingToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const hasHandled = useRef(false);
  const legacyToken = searchParams.get('token')?.trim() ?? '';
  const code = searchParams.get('code')?.trim() ?? '';
  const oauthError = searchParams.get('error')?.trim() ?? '';

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const handleOAuthCallback = async () => {
      if (legacyToken) {
        setToken(legacyToken);
        navigate('/', { replace: true });
        return;
      }

      if (oauthError || !code) {
        clearAuth();
        toast.error('구글 로그인 실패');
        navigate('/auth/signin', { replace: true });
        return;
      }

      try {
        const data = await exchangeGoogleOAuthCode(code);

        if (data.requiresExtraSignup) {
          setPendingToken(data.token);
          navigate('/auth/signup/google', { replace: true });
          return;
        }

        setAuth(data);
        navigate('/', { replace: true });
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? '구글 로그인 실패';

        clearAuth();
        toast.error(message);
        navigate('/auth/signin', { replace: true });
      }
    };

    void handleOAuthCallback();
  }, [
    clearAuth,
    code,
    legacyToken,
    navigate,
    oauthError,
    setAuth,
    setPendingToken,
    setToken,
  ]);

  return null;
}

export default GoogleOAuthCallback;
