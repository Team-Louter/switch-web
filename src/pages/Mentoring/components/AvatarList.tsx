import * as S from "./styles/AvatarList.styled";
import type { AvatarItem } from "./types/AvatarList.type";
import kebabMenu from "../../../assets/mentoringImg/kebab.png";

interface AvatarListItemProps {
  item: AvatarItem;
  isClicked: boolean;
  onClick: () => void;
}

function AvatarListItem({ item, isClicked, onClick }: AvatarListItemProps) {
  return (
    <S.container $isClicked={isClicked} onClick={onClick}>
      <S.profile>
        <S.avatarArea>
          {item.type === "single" ? (
            <S.userImg src={item.userImg} />
          ) : (
            <S.avatarGroup>
              {item.users.slice(0, 4).map((u) => (
                <S.userImg key={u.id} src={u.img} $isGroup={true} />
              ))}
            </S.avatarGroup>
          )}
        </S.avatarArea>
        <S.userName>{item.name}</S.userName>
      </S.profile>
      <S.Kebab src={kebabMenu} />
    </S.container>
  );
}

interface AvatarListProps {
  data: AvatarItem[];
  selectedId: number | null;
  onSelect: (item: AvatarItem) => void;
}

export default function AvatarList({ data, selectedId, onSelect }: AvatarListProps) {
  return (
    <>
      {data.map((item) => (
        <AvatarListItem
          key={item.id}
          item={item}
          isClicked={selectedId === item.id}
          onClick={() => onSelect(item)}
        />
      ))}
    </>
  );
}