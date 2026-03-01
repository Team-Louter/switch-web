import styled from "styled-components";
import * as token from "@/styles/values/token";

export const CommentRow = styled.div<{ isReply?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  margin-left: ${({ isReply }) => (isReply ? 3.125 : 0)}rem;
  margin-bottom: 1.25rem;
`;


export const ProfileGroup = styled.div<{ hasReply?: boolean }>`
  position: relative;
  width: 1.75rem;
  display: flex;
  justify-content: center;

  &::after {
    content: "";
    position: absolute;
    top: 1.75rem;
    bottom: 0;
    width: 2px;
    background-color: ${token.colors.accent.assistive3};
    display: ${({ hasReply }) => (hasReply ? "block" : "none")};
  }
`;

export const Avatar = styled.img<{ isReply?: boolean }>`
  width: ${({isReply}) => (isReply ? 1.75 : 2.1875)}rem;
  height: ${({isReply}) => (isReply ? 1.75 : 2.1875)}rem;
  border-radius: ${token.shapes.xlarge};
  object-fit: cover;
`;7

export const ContentGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const UserName = styled.div`
  ${token.typography("caption", "lg", "semibold")}
`;

export const CommentMetaRow = styled.div`
  ${token.flexRow}
  align-items: flex-end;
  gap: 10px;
`;

// CommentText에서 padding 제거하고 내부 텍스트에 패딩 적용
export const CommentText = styled.div<{ isRoot?: boolean }>`
  background-color: ${token.colors.background.white};
  overflow: hidden;

  border: 1px solid
    ${({ isRoot }) =>
      isRoot
        ? token.colors.main.alternative
        : token.colors.line.normal};

  border-radius: ${token.shapes.medium};

  ${({ isRoot }) =>
    isRoot
      ? token.typography("body", "lg", "medium")
      : token.typography("body", "md", "medium")}
`;


export const CommentTextInner = styled.div`
  padding: 15px 20px;
`;

export const BlockCodeWrapper = styled.div`
  overflow: hidden;
  /* border-radius: 0 0 ${token.shapes.medium} ${token.shapes.medium}; */
`;

export const Time = styled.div`
  ${token.typography("body", "sm", "medium")}
  color: ${token.colors.text.disabled};
  white-space: nowrap;
`;

export const InlineCode = styled.code`
  background-color: ${token.colors.text.normal};
  color: ${token.colors.background.white};
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Fira Code", "Courier New", monospace;
  font-size: 0.9em;
`;
