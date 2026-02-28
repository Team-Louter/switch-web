import { useNavigate } from 'react-router-dom';
import * as S from './style';
import LogoSvg from '@/assets/AuthImg/AuthLogo.svg';
import GoogleIcon from '@/assets/Google/Google.svg';

function Signup() {
  const navigate = useNavigate();

  const handleTest = () => {
    navigate('/');
  };

  const handleSignupGoogle = () => {
    navigate('/auth/signup/Google');
  };

  const handleSignin = () => {
    navigate('/auth/signin');
  };

  return (
    <S.Container>
      <S.LoginContainer>
        <S.AuthMainImgContainer />
        <S.AuthContent>
          <S.LogoImg src={LogoSvg} alt="Logo" />

          <S.GoogleContent>
            <S.SocialTitle>학생 계정으로 회원가입</S.SocialTitle>

            <S.GoogleButton onClick={handleSignupGoogle}>
              <S.GoogleIcon src={GoogleIcon} alt="Google" />
              Google로 시작하기
            </S.GoogleButton>
          </S.GoogleContent>

          <S.Line />

          <S.LoginForm>
            <S.Input type="text" placeholder="학번" required />
            <S.Input type="text" placeholder="이름" required />
            <S.Input type="password" placeholder="비밀번호" required />
            <S.Input type="password" placeholder="비밀번호 확인" required />
            <S.Input type="email" placeholder="이메일" required />
            <S.Input type="text" placeholder="동아리 코드" required />
            <S.Inputgap />
            <S.LoginButton type="button" onClick={handleTest}>
              회원가입
            </S.LoginButton>
          </S.LoginForm>

          <S.SignupText>
            이미 계정이 있으신가요?{' '}
            <S.SignupLink onClick={handleSignin}>로그인</S.SignupLink>
          </S.SignupText>

          <S.Line />

          <S.PolicyText>
            The Google{' '}
            <S.PolicyLink
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </S.PolicyLink>{' '}
            and{' '}
            <S.PolicyLink
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </S.PolicyLink>{' '}
            apply.
          </S.PolicyText>
        </S.AuthContent>
      </S.LoginContainer>
    </S.Container>
  );
}

export default Signup;
