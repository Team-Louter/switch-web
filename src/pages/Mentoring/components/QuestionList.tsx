import * as S from "./styles/QuestionList.styled";
import { useState } from "react";
import type { QuestionListProps } from "./types/QuestionList.types";

export default function QuestionList({ questions }: { questions: QuestionListProps["question"][] }) {
  const [clickedId, setClickedId] = useState<number | null>(null);

  return (
    <>
      <S.ListWrapper>
        {questions.map((question, i) => (
          <S.container
            key={i}
            $isClicked={clickedId === i}
            onClick={() => setClickedId(clickedId === i ? null : i)}
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
    </>
  );
}
