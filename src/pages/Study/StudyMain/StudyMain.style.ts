import styled, { keyframes } from "styled-components";
import * as token from "@/styles/values/token";

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

export const container = styled.div`
  background-color: ${token.colors.background.lightGray};
  width: 100%;
  height: calc(100vh - 60px);
  ${token.flexColumnCenter};
  justify-content: flex-start;
  gap: 120px;
  overflow-y: scroll;
  padding: 60px 0;
`

export const SkeletonContainer = styled(container)`
  cursor: default;
`

export const SkeletonMonthSection = styled.div`
  width: 90%;
  ${token.flexColumn};
  gap: 0;
`

export const SkeletonMonthCard = styled.div`
  width: 100%;
  height: 180px;
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xlarge};
  ${token.flexRow};
  align-items: stretch;
`

export const SkeletonWeekBlock = styled.div`
  width: 25%;
  height: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
  ${token.flexColumnCenter};
  justify-content: space-between;
  gap: 18px;

  &:not(:last-child) {
    border-right: 1px solid ${token.colors.line.normal};
  }
`

export const SkeletonWeekLabel = styled.div`
  width: 58px;
  height: 24px;
  border-radius: ${token.shapes.small};
  background: linear-gradient(
    90deg,
    ${token.colors.fill.f3} 25%,
    ${token.colors.fill.normal} 50%,
    ${token.colors.fill.f3} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s infinite linear;
`

export const SkeletonWeekContent = styled.div`
  width: 100%;
  height: 56px;
  border-radius: ${token.shapes.medium};
  background: linear-gradient(
    90deg,
    ${token.colors.fill.f3} 25%,
    ${token.colors.fill.normal} 50%,
    ${token.colors.fill.f3} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s infinite linear;
`
