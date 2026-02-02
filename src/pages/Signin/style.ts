import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10rem 18rem;
  width: 100%;
  height: calc(100vh - 4.5rem);
  background-color: #ffffff;
  overflow-y: none;
`;

export const LoginContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.line.light};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const AuthMainImg = styled.img`
  width: auto;
  height: 100%;
  border-radius: 8px 0px 0px 8px;
`;

export const AuthContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 50%;
  height: 100%;
  padding: 48px 33px;
  gap: 24px;
`;

export const LogoImg = styled.img`
  width: auto;
  height: 63px;
`;

export const SocialTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.body.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.dark};
`;