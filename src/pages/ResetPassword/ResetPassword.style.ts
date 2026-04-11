import styled, { keyframes } from 'styled-components';
import * as token from '@/styles/values/token';
import AuthMainImg from '@/assets/AuthImg/AuthMainImg.png';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

export const ButtonSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top-color: ${token.colors.text.dark};
  border-right-color: ${token.colors.text.dark};
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
  display: inline-block;
`;

export const Container = styled.div`
  ${token.flexCenter}
  min-height: calc(100vh - 72px);
  background-color: ${token.colors.main.white};
  padding: 2rem;
`;

export const Card = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 991px;
  min-height: 600px;
  height: auto;
  background-color: ${token.colors.main.white};
  border-radius: ${token.shapes.xlarge};
  ${token.elevation('black_3')}
  overflow: hidden;
  zoom: 0.9;
`;

export const AuthMainImgContainer = styled.div`
  width: 62%;
  ${token.flexCenter}
  background-image: url(${AuthMainImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const Content = styled.div`
  ${token.flexColumn}
  align-items: center;
  width: 38%;
  height: 100%;
  padding: 3rem 2rem;
  gap: 1.5rem;
  justify-content: flex-start;
`;

export const TabContent = styled.div`
  ${token.flexColumn}
  align-items: center;
  width: 100%;
  gap: 2.5rem;
  flex: 1;
  justify-content: space-between;
`;

export const FormContent = styled.div`
  ${token.flexColumn}
  align-items: center;
  width: 100%;
  gap: 1.5rem;
  min-height: 380px;
`;

export const Title = styled.h2`
  ${token.typography('heading', 'lg', 'bold')}
  color: ${token.colors.text.dark};
  margin: 0 0 0.5rem;
  text-align: center;
`;

export const Subtitle = styled.p`
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.coolGray};
  text-align: center;
  margin: 0 0 1.5rem;
`;

export const Form = styled.div`
  ${token.flexColumn}
  gap: 0.875rem;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  ${token.typography('body', 'sm', 'semibold')}
  color: ${token.colors.text.dark};
  transition: all 0.2s ease;
  box-sizing: border-box;

  &::placeholder {
    color: ${token.colors.text.coolGray};
  }

  &:focus {
    outline: none;
    border-color: ${token.colors.main.black};
    background-color: ${token.colors.main.white};
  }
`;

export const SubmitButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${token.colors.main.yellow};
  border: none;
  border-radius: 50px;
  ${token.typography('body', 'sm', 'bold')}
  color: ${token.colors.text.dark};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background-color: ${token.colors.accent.secondary1};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;
