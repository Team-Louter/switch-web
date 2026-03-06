import styled from "styled-components";
import * as token from "@/styles/values/token";

export const container = styled.div`
  width: 600px;
  height: 90vh;
  max-height: 750px;
  min-height: 400px;
  background-color: ${token.colors.background.white};
  padding: 30px;
  border-radius: ${token.shapes.xlarge};
  ${token.flexColumn}
  gap: 20px;
  overflow: hidden;
`;

export const TitleCancelContainer = styled.div`
  ${token.flexRow}
  justify-content: space-between;
`;

export const Title = styled.span`
  ${token.typography("body", "lg", "semibold")}
`;

export const Cancel = styled.img`
  width: 19px;
  height: 19px;
  cursor: pointer;
`;

export const Wrapper = styled.div`
  width: 19px;
  height: 19px;
`;

export const RoomName = styled.input`
  padding: 14px 20px;
  border-radius: ${token.shapes.medium};
  border: 1px solid ${token.colors.line.normal};
  ${token.typography("body", "sm", "regular")}
  &:focus {
    outline: none;
  }
`;

export const AddMemberContainer = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const DoneButton = styled.button`
  width: 100%;
  padding: 10px 20px;
  ${token.typography("body", "sm", "semibold")}
  color: ${token.colors.fill.assistive};
  background-color: ${token.colors.main.alternative};
  border-radius: ${token.shapes.medium};
`