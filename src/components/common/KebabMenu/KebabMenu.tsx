import type { ReactNode, MouseEvent } from "react";
import { useKebab } from "@/hooks/useKebab";
import * as S from "./KebabMenu.styled";

export type KebabMenuItem = {
  label: string;
  onClick: () => void;
  // 권한/작성자 여부에 따라 항목 노출을 제어할 때 사용
  // 예: { label: "고정하기", onClick: handlePin, visible: isMentor }
  visible?: boolean;
};

interface KebabMenuProps {
  items: KebabMenuItem[];
  trigger: ReactNode;
}

export default function KebabMenu({ items, trigger }: KebabMenuProps) {
  const { isKebabOpen, setIsKebabOpen, kebabRef } = useKebab();
  // visible이 false인 항목은 렌더링 x
  const visibleItems = items.filter((item) => item.visible !== false);

  const handleTriggerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsKebabOpen((prev) => !prev);
  };

  return (
    <S.Wrapper ref={kebabRef}>
      <S.Trigger onClick={handleTriggerClick}>{trigger}</S.Trigger>
      {isKebabOpen && visibleItems.length > 0 && (
        <S.Container>
          {visibleItems.map((item) => (
            <S.Label
              key={item.label}
              onClick={() => {
                item.onClick();
                setIsKebabOpen(false);
              }}
            >
              {item.label}
            </S.Label>
          ))}
        </S.Container>
      )}
    </S.Wrapper>
  );
}
