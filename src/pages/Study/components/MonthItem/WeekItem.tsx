import * as S from "./WeekItem.styled";
import StudyAddButton from "../../../../assets/study/studyAdd.png";

interface WeekItemProps {
  weekNumber: number;
  content?: string;
  isCurrentWeek?: boolean;
  isPast?: boolean;
  onAdd?: () => void;
  onDetail?: () => void;
}

export default function WeekItem({
  weekNumber,
  content,
  isCurrentWeek = false,
  isPast = false,
  onAdd,
  onDetail,
}: WeekItemProps) {

  // 현재 주차
  if (isCurrentWeek) {
    return (
      <S.Container>
        {weekNumber}주차
        <S.ContentContainer>
          <S.AddButton src={StudyAddButton} onClick={onAdd} />
          <S.AddText>이번 주 학습을 돌아보며 기록해 볼까요?</S.AddText>
        </S.ContentContainer>
      </S.Container>
    );
  }

  // 내용 있음
  if (content) {
    return (
      <S.Container>
        {weekNumber}주차
        <S.ContentContainer>
          <S.DetailButton onClick={onDetail}>{content}</S.DetailButton>
        </S.ContentContainer>
      </S.Container>
    );
  }

  // 지나간 주차
  if (isPast) {
    return (
      <S.Container>
        {weekNumber}주차
        <S.ContentContainer>
          <S.EmptyText>학습 일지가 없어요.</S.EmptyText>
        </S.ContentContainer>
      </S.Container>
    );
  }

  // 아직 오지 않은 주차
  return (
    <S.Container>
      {weekNumber}주차
      <S.ContentContainer>
        <S.EmptyText>기록 기간이 아니에요.</S.EmptyText>
      </S.ContentContainer>
    </S.Container>
  );
}