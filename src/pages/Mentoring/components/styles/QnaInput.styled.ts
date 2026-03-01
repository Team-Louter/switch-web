import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.medium};
  background-color: ${token.colors.background.white};
`;

export const TextareaWrapper = styled.div`
  overflow-y: auto;
  max-height: calc(3 * 1.5em + 20px);
  padding: 10px 16px 0;
`;

export const Input = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  line-height: 1.5;
  box-sizing: border-box;
  ${token.typography("body", "sm", "medium")}
  color: ${token.colors.text.normal};
  background: transparent;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  flex-shrink: 0;
`;

export const ToolLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ToolRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${token.shapes.small};

  &:hover {
    background-color: ${token.colors.background.lightGray};
  }
`;

export const CharCount = styled.span<{ isOver: boolean }>`
  ${token.typography("body", "sm", "medium")}
  color: ${({ isOver }) => (isOver ? token.colors.state.errorSoft : token.colors.text.disabled)};
`;