import { useState, useEffect } from "react";
import * as S from "./StudyModal.styled";
import cancelImg from "@/assets/cancel.png";
import { createStudy, updateStudy, deleteStudy, type StudyResponse } from "@/api/Study";
import KebabMenu from "@/components/common/KebabMenu/KebabMenu";

interface StudyModalProps {
  month: number;
  weekNumber: number;
  study?: StudyResponse | null;
  isReadOnly?: boolean;
  isMentee?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudyModal({ 
  month, 
  weekNumber, 
  study, 
  isReadOnly: initialIsReadOnly = false,
  isMentee,
  onClose, 
  onSuccess 
}: StudyModalProps) {
  const fallbackFullContent = study?.fullContent ?? "";
  const readOnlyOwnContent = study?.ownContent || fallbackFullContent;
  const readOnlyClubContent = study?.clubContent ?? "";

  // 데이터가 없으면 작성 모드로 시작
  const [isReadOnly, setIsReadOnly] = useState(study ? initialIsReadOnly : false);
  const [title, setTitle] = useState(study?.title ?? "");
  const [ownContent, setOwnContent] = useState(study?.ownContent ?? fallbackFullContent);
  const [clubContent, setClubContent] = useState(study?.clubContent ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const MAX_LENGTH = 1000;
  const resolvedMonth = Number(study?.month ?? study?.month_number ?? month);
  const resolvedWeekNumber = Number(study?.weekNumber ?? study?.week_number ?? weekNumber);

  useEffect(() => {
    // 데이터가 없으면 무조건 작성 모드, 데이터가 있을 때만 요청받은 ReadOnly 상태 적용
    setIsReadOnly(study ? initialIsReadOnly : false);
    setTitle(study?.title ?? "");
    setOwnContent(study?.ownContent ?? study?.fullContent ?? "");
    setClubContent(study?.clubContent ?? "");
  }, [initialIsReadOnly, study]);

  const handleSubmit = async () => {
    if (isReadOnly) return;
    setIsLoading(true);
    try {
      if (study) {
        const id = study.studyId ?? (study as any).study_id;
        await updateStudy(id, {
          title,
          month: resolvedMonth,
          weekNumber: resolvedWeekNumber,
          ownContent,
          clubContent,
        });
      } else {
        await createStudy({
          title,
          month,
          weekNumber,
          ownContent,
          clubContent,
        });
      }
      onSuccess();
    } catch (e) {
      alert("저장에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!study) return;
    if (!window.confirm("이 학습 일지를 삭제하시겠습니까?")) return;

    setIsLoading(true);
    try {
      const id = study.studyId ?? (study as any).study_id;
      await deleteStudy(id);
      onSuccess();
    } catch (e) {
      alert("삭제에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (study) {
      // 수정 중이었다면 조회 모드로 복구
      setIsReadOnly(true);
      setTitle(study.title ?? "");
      setOwnContent(study.ownContent ?? study.fullContent ?? "");
      setClubContent(study.clubContent ?? "");
    } else {
      // 새 글 작성 중이었다면 모달 닫기
      onClose();
    }
  };

  const kebabItems = [
    {
      label: "수정",
      onClick: () => {
        setIsReadOnly(false);
      },
    },
    {
      label: "삭제",
      onClick: () => {
        handleDelete();
      },
    },
  ];

  return (
    <S.Overlay>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.TitleCancelContainer>
          {isReadOnly && study && isMentee ? (
            <S.KebabWrapper>
              <KebabMenu
                items={kebabItems}
                trigger={
                  <S.KebabIcon>
                    <div /><div /><div />
                  </S.KebabIcon>
                }
              />
            </S.KebabWrapper>
          ) : (
            <S.Wrapper />
          )}
          <S.Title>
            {month}월 {weekNumber}주차 학습 일지 {isReadOnly ? "조회" : study ? "수정" : "기록"}
          </S.Title>
          <S.Cancel src={cancelImg} onClick={onClose} />
        </S.TitleCancelContainer>

        <S.StudyInputContainer>
          <S.StudyTitleInput
            placeholder={isReadOnly ? "" : "제목을 입력해 주세요."}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            readOnly={isReadOnly}
          />
          <S.StudyInputdivider />
        </S.StudyInputContainer>

        <S.InputContainer>
          <S.InputBlock>
            <S.SectionTitle>개인 학습</S.SectionTitle>
            <S.InputField
              maxLength={MAX_LENGTH}
              value={isReadOnly ? readOnlyOwnContent : ownContent}
              onChange={(e) => setOwnContent(e.target.value)}
              placeholder={isReadOnly ? "작성된 내용이 없습니다." : "개인적으로 한 공부에 대해 작성해 보세요."}
              readOnly={isReadOnly}
              $isReadOnly={isReadOnly}
            />
            {!isReadOnly && <S.CharCount>{ownContent.length}/{MAX_LENGTH}</S.CharCount>}
          </S.InputBlock>

          <S.InputBlock>
            <S.SectionTitle>동아리 학습</S.SectionTitle>
            <S.InputField
              maxLength={MAX_LENGTH}
              value={isReadOnly ? readOnlyClubContent : clubContent}
              onChange={(e) => setClubContent(e.target.value)}
              placeholder={isReadOnly ? "작성된 내용이 없습니다." : "동아리에서 한 공부에 대해 작성해 보세요."}
              readOnly={isReadOnly}
              $isReadOnly={isReadOnly}
            />
            {!isReadOnly && <S.CharCount>{clubContent.length}/{MAX_LENGTH}</S.CharCount>}
          </S.InputBlock>
        </S.InputContainer>
        
        {isReadOnly ? (
          <S.Button onClick={onClose}>닫기</S.Button>
        ) : (
          <S.ButtonContainer>
            <S.CancelButton onClick={handleCancel}>취소</S.CancelButton>
            <S.Button onClick={handleSubmit} disabled={isLoading}>
              {study ? "수정 완료" : "기록 완료"}
            </S.Button>
          </S.ButtonContainer>
        )}
      </S.Container>
    </S.Overlay>
  );
}
