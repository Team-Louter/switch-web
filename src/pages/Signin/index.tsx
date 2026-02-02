// import { useNavigate } from 'react-router-dom';
import * as S from './style';
import LogoSvg from '@/assets/Logo/Logo.svg';
import AuthMainImg from '@/assets/AuthImg/AuthMainImg.png';

function Topbar() {
  // const navigate = useNavigate();

  return (
    <S.Container>
      <S.LoginContainer>
        <S.AuthMainImg src={AuthMainImg} alt="AuthMainImg" />
        <S.AuthContent>
          <S.LogoImg src={LogoSvg} alt="Logo" />
          <S.SocialTitle>소셜 로그인</S.SocialTitle>
        </S.AuthContent>
      </S.LoginContainer>
    </S.Container>
  );
}

export default Topbar;
