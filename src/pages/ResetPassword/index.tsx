import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as S from './ResetPassword.styled';
import { resetPassword } from '@/api/Auth';
import { toast } from '@/store/toastStore';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) return;
    if (newPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, newPassword, confirmPassword);
      toast.success('비밀번호가 변경되었습니다. 다시 로그인해 주세요.');
      navigate('/auth/signin');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? '비밀번호 변경에 실패했습니다.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Container>
      <S.Card>
        <S.AuthMainImgContainer />
        <S.Content>
          <S.TabContent>
            <S.FormContent>
              <S.Title>새 비밀번호 설정</S.Title>
              <S.Subtitle>사용할 새 비밀번호를 입력해 주세요.</S.Subtitle>
              <S.Form>
                <S.Input
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <S.Input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      newPassword.trim() &&
                      confirmPassword.trim()
                    )
                      handleResetPassword();
                  }}
                />
              </S.Form>
            </S.FormContent>
            <S.SubmitButton
              $disabled={
                !newPassword.trim() || !confirmPassword.trim() || isLoading
              }
              disabled={
                !newPassword.trim() || !confirmPassword.trim() || isLoading
              }
              onClick={handleResetPassword}
            >
              {isLoading ? <S.ButtonSpinner /> : '비밀번호 변경'}
            </S.SubmitButton>
          </S.TabContent>
        </S.Content>
      </S.Card>
    </S.Container>
  );
}

export default ResetPassword;
