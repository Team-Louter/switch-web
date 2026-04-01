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

export const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px);
  ${token.flexColumn}
  align-items: center;
  background-color: ${token.colors.background.lightGray};
  padding: 40px;
  box-sizing: border-box;
`

export const NavHeader = styled.div`
  width: 100%;
  ${token.flexRow}
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

export const NavSide = styled.div`
  min-width: 144px;
  ${token.flexRow}
  align-items: center;
  justify-content: flex-end;
`;

export const NavCenter = styled.div`
  ${token.flexRow}
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const NavTitle = styled.h2`
  ${token.typography("heading", "md", "semibold")}
  color: ${token.colors.text.strong};
  min-width: 150px;
  text-align: center;
`;

export const NavButton = styled.button`
  width: 17px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  ${token.flexCenter}
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.5;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

export const ReportButton = styled.button`
  min-width: 144px;
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: ${token.shapes.medium};
  background-color: ${token.colors.main.alternative};
  color: ${token.colors.main.white};
  ${token.typography("body", "sm", "semibold")};
  cursor: pointer;
`;

export const PostGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  align-items: start;
`;

export const SkeletonPost = styled.div`
  width: 100%;
  ${token.flexColumnCenter};
  gap: 10px;
`

export const SkeletonAuthor = styled.div`
  width: 84px;
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

export const SkeletonCard = styled.div`
  width: 100%;
  padding: 20px 30px;
  background-color: ${token.colors.main.white};
  border-radius: ${token.shapes.medium};
  border: 1px solid ${token.colors.line.normal};
  box-sizing: border-box;
  ${token.flexColumn};
  gap: 12px;
`

export const SkeletonTitle = styled.div`
  width: 58%;
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

export const SkeletonContent = styled.div`
  width: 100%;
  height: 18px;
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

export const SkeletonContentShort = styled(SkeletonContent)`
  width: 72%;
`

export const SkeletonButton = styled.div`
  width: 100%;
  height: 34px;
  margin-top: 6px;
  border-radius: ${token.shapes.xsmall};
  background: linear-gradient(
    90deg,
    ${token.colors.fill.f3} 25%,
    ${token.colors.fill.normal} 50%,
    ${token.colors.fill.f3} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s infinite linear;
`

export const EmptyState = styled.div`
  width: 100%;
  height: 300px;
  ${token.flexColumnCenter}
  ${token.typography("body", "md", "medium")}
  color: ${token.colors.text.neutral};
  opacity: 0.6;
`;
