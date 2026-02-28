import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';
import LogoSvg from '@/assets/AuthImg/AuthLogo.svg';

function SignupCheck() {
  const navigate = useNavigate();
  const [allChecked, setAllChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const handleAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    setPrivacyChecked(next);
  };

  const handlePrivacy = () => {
    const next = !privacyChecked;
    setPrivacyChecked(next);
    setAllChecked(next);
  };

  const handleSignin = () => {
    navigate('/auth/signin');
  };

  const handleAgree = () => {
    if (privacyChecked) navigate('/auth/signup');
  };

  return (
    <S.Container>
      <S.SigninContainer>
        <S.AuthMainImgContainer />
        <S.AuthContent>
          <S.LogoImg src={LogoSvg} alt="Logo" />

          <S.SocialTitle>약관 동의서</S.SocialTitle>

          <S.AgreementList>
            <S.AgreementItem onClick={handleAll}>
              <S.Checkbox checked={allChecked} readOnly />
              <S.AgreementLabel>전체 동의</S.AgreementLabel>
            </S.AgreementItem>

            <S.AgreementItem onClick={handlePrivacy}>
              <S.Checkbox checked={privacyChecked} readOnly />
              <S.AgreementLabel>
                개인정보 수집 및 이용 동의&nbsp;<S.Required>(필수)</S.Required>
              </S.AgreementLabel>
            </S.AgreementItem>
          </S.AgreementList>

          <S.PolicyBox>
            <S.PolicyBoxTitle>개인정보 수집·이용 동의서</S.PolicyBoxTitle>
            <S.PolicyBoxText>
              본 커뮤니티는 학교 동아리 내 신입생 멘토링 및 커뮤니티 운영을
              목적으로 개인정보를 수집·이용합니다.
              <br />
              <br />
              1. 수집하는 개인정보 항목
              <br />
              성명, 학번, 이메일 주소, 소속 학과
              <br />
              <br />
              2. 개인정보 수집·이용 목적
              <br />
              회원 식별 및 본인 확인
              <br />
              동아리 멘토링 커뮤니티 서비스 제공
              <br />
              멘토링 참여 및 커뮤니티 운영 관리
              <br />
              <br />
              3. 보유 및 이용 기간
              <br />
              회원 탈퇴 시 즉시 파기
              <br />
              <br />
              4. 동의 거부 권리 및 불이익
              <br />
              개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
              다만, 필수 정보 수집에 동의하지 않을 경우 회원가입 및 서비스 이용이 제한될 수 있습니다.
              <br />
              <br />
              본인은 위 내용을 충분히 이해하였으며, 개인정보 수집·이용에
              동의합니다.
            </S.PolicyBoxText>
          </S.PolicyBox>

          <S.SigninButton
            type="button"
            onClick={handleAgree}
            disabled={!privacyChecked}
          >
            동의합니다
          </S.SigninButton>

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
      </S.SigninContainer>
    </S.Container>
  );
}

export default SignupCheck;
