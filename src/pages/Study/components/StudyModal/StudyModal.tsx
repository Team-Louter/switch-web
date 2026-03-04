import { useState } from "react";
import * as S from "./StudyModal.styled";
import cancelImg from "../../../../assets/cancel.png";
import { createStudy, updateStudy, type StudyResponse } from "../../../../api/Study";

interface StudyModalProps {
  month: number;
  weekNumber: number;
  study?: StudyResponse | null;
  onClose: () => void;
}

export default function StudyModal({ month, weekNumber, study, onClose }: StudyModalProps) {
  const [title, setTitle] = useState(study?.title ?? "");
  const [text, setText] = useState(study?.content ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const MAX_LENGTH = 1000;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (study) {
        // 수정
        await updateStudy(study.studyId, { title, content: text });
      } else {
        // 작성
        await createStudy({ title, content: text, month, weekNumber });
      }
      onClose();
    } catch (e) {
      alert("저장에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <S.Container>
        <S.TitleCancelContainer>
          <S.Wrapper />
          <S.Title>{month}월 {weekNumber}주차 학습 일지 기록</S.Title>
          <S.Cancel src={cancelImg} onClick={onClose} />
        </S.TitleCancelContainer>

        <S.StudyInputContainer>
          <S.StudyTitleInput
            placeholder="제목을 입력해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <S.StudyInputdivider />
        </S.StudyInputContainer>

        <S.InputContainer
          maxLength={MAX_LENGTH}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="내용을 입력해 주세요."
        />
        <S.CharCount>{text.length}/{MAX_LENGTH}</S.CharCount>
        <S.Button onClick={handleSubmit} disabled={isLoading}>
          완료
        </S.Button>
      </S.Container>
    </>
  );
}