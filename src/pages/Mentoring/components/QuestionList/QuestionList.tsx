import * as S from "./QuestionList.styled";
import type { Question } from "@/types/mentoring";
import KebabMenu from "@/components/common/KebabMenu/KebabMenu";
import kebabIcon from "@/assets/mentoringImg/kebab.png";

interface QuestionListProps {
  questions: Question[];
  selectedId: number | null;
  onSelect: (question: Question) => void;
  onDelete?: (id: number) => void;
}

interface QuestionListItemProps {
  question: Question;
  isClicked: boolean;
  onSelect: (question: Question) => void;
  onDelete?: (id: number) => void;
}

function QuestionListItem({
  question,
  isClicked,
  onSelect,
  onDelete,
}: QuestionListItemProps) {
  const kebabItems = [
    {
      label: "삭제",
      onClick: () => {
        onDelete?.(question.id);
      },
    },
  ];

  return (
    <S.container
      $isClicked={isClicked}
      $status={question.status}
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

      <KebabMenu items={kebabItems} trigger={<S.KebabIcon src={kebabIcon} />} />
    </S.container>
  );
}

export default function QuestionList({
  questions,
  selectedId,
  onSelect,
  onDelete,
}: QuestionListProps) {
  return (
    <S.ListWrapper>
      {questions.map((question) => (
        <QuestionListItem
          key={question.id}
          question={question}
          isClicked={selectedId === question.id}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </S.ListWrapper>
  );
}
