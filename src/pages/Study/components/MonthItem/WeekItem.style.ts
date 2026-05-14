import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div<{ $isFuture?: boolean; $weekCount: number }>`
  width: ${({ $weekCount }) => `${100 / $weekCount}%`};
  height: 100%;
  ${token.flexColumnCenter};
  justify-content: space-between;
  ${token.typography("body", "md", "semibold")};
  color: ${props => props.$isFuture ? token.colors.text.disabled : token.colors.text.neutral};
  padding: 40px 20px;
  gap: 5px;
  box-sizing: border-box;

  &:not(:last-child) {
    border-right: 1px solid ${token.colors.line.normal};
  }
`

export const ContentContainer = styled.div`
  width: 100%;
  height: 50px;
  ${token.flexColumnCenter}
  gap: 8px;
`

export const DetailButton = styled.button`
  padding: 15px 18px;
  background-color: ${token.colors.main.alternative};
  color: ${token.colors.text.neutral};
  border-radius: ${token.shapes.medium};
  ${token.typography("body", "sm", "medium")};
`

export const AddButton = styled.img`
  width: 23px;
  height: 23px;
  color: ${token.colors.text.neutral};
  font-size: 20px;
  ${token.flexCenter};
`

export const AddText = styled.span`
${token.typography("body", "sm", "medium")};
`

export const EmptyText = styled.span`
  ${token.typography("body", "sm", "medium")};
  color: ${token.colors.text.neutral};
  opacity: 0.3;
`
