import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Container = styled.div`
  width: min(1100px, 90vw);
  height: min(800px, 90vh);
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xlarge};
  padding: 28px;
  box-sizing: border-box;
  ${token.flexColumn}
  gap: 20px;
`;

export const Header = styled.div`
  ${token.flexRow}
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const TitleGroup = styled.div`
  ${token.flexColumn}
`;

export const Title = styled.h2`
  margin: 0;
  ${token.typography("body", "lg", "semibold")};
  color: ${token.colors.text.strong};
`;

export const CloseButton = styled.img`
  width: 19px;
  height: 19px;
  cursor: pointer;
`;

export const CalendarSection = styled.div`
  flex: 1;
  min-height: 0;
`;

export const Footer = styled.div`
  width: 100%;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 14px 18px;
  border: none;
  border-radius: ${token.shapes.medium};
  background-color: ${token.colors.main.alternative};
  color: ${token.colors.main.white};
  ${token.typography("body", "sm", "medium")};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
