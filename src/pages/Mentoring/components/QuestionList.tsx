import * as S from "./styles/QuestionList.styled";
import type { QuestionListProps } from "./types/QuestionList.type";

export default function QuestionList({
  questions,
  selectedId,
  onSelect,
}: QuestionListProps) {
  return (
    <S.ListWrapper>
      {questions.map((question) => (
        <S.container
          key={question.id}
          $isClicked={selectedId === question.id}
          onClick={() => onSelect(question)}
        >
          <S.questionItem>
            <S.questionHeader>
              <S.questionTitle>{question.title}</S.questionTitle>
              <S.questionDate>{question.date}</S.questionDate>
            </S.questionHeader>
            <S.status>
              <S.statusText>상태</S.statusText>
              <S.statusBadge $status={question.status}>
                {question.status}
              </S.statusBadge>
            </S.status>
          </S.questionItem>
        </S.container>
      ))}
    </S.ListWrapper>
  );
}
