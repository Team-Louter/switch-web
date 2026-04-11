import { useEffect, useState } from 'react';
import * as S from './Toast.style.ts';
import { useToastStore } from '@/store/toastStore';

import errorImg from '@/assets/Toast/error.svg';
import successImg from '@/assets/Toast/success.svg';
import warningImg from '@/assets/Toast/warning.svg';

const ICONS = {
  error: (
    <img src={errorImg} alt="Error" />
  ),
  success: (
    <img src={successImg} alt="Success" />
  ),
  warning: (
    <img src={warningImg} alt="Warning" />
  ),
};

const AUTO_CLOSE = 2000; // 토스트가 자동으로 닫히는 시간 (ms)
const EXIT_DURATION = 200; // exit 애니메이션 지속 시간 (ms)

// 전역 토스트 알림 컴포넌트 — App.tsx에 한 번만 렌더링
function Toast() {
  const { id, message, type, hide } = useToastStore();
  // 실제 DOM 마운트 여부 (exit 애니메이션 끝난 후 언마운트)
  const [mounted, setMounted] = useState(false);
  // 애니메이션 방향 제어
  const [animating, setAnimating] = useState(false);

  // id가 바뀔 때마다 실행 — 토스트 표시 → 자동 닫기
  useEffect(() => {
    if (!id) return;

    setMounted(true);
    setAnimating(true);

    // autoClose 후 exit 애니메이션 시작
    const exitTimer = setTimeout(() => {
      setAnimating(false); // slide-up 시작
    }, AUTO_CLOSE);

    // exit 애니메이션 끝나면 언마운트
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      hide();
    }, AUTO_CLOSE + EXIT_DURATION);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [id]); // id가 바뀔 때마다 항상 재실행

  if (!mounted) return null;

  return (
    <S.Wrapper $visible={animating} $exitDuration={EXIT_DURATION}>
      <S.ToastBox>
        <S.IconCircle $type={type}>{ICONS[type]}</S.IconCircle>
        <S.Message>{message}</S.Message>
      </S.ToastBox>
    </S.Wrapper>
  );
}

export default Toast;
