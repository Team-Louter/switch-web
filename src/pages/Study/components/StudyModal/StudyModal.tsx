import { useState, useEffect } from "react";
import { FaFlag } from "react-icons/fa6";
import * as S from "./StudyModal.styled";
import cancelImg from "@/assets/cancel.png";
import { createStudy, updateStudy, deleteStudy, type StudyResponse } from "@/api/Study";
import {
  type ClubReportResponse,
} from "@/api/ClubReport";
import { getEvent } from "@/api/Event";
import type { Event } from "@/types/fullCalendar";
import KebabMenu from "@/components/common/KebabMenu/KebabMenu";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import { toast } from "@/store/toastStore";

interface StudyModalProps {
  month: number;
  weekNumber: number;
  study?: StudyResponse | null;
  clubReport?: ClubReportResponse | null;
  mode?: "study" | "clubReport";
  isReadOnly?: boolean;
  isMentee?: boolean;
  onRegenerateClubReport?: (clubReport: ClubReportResponse) => Promise<void> | void;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudyModal({ 
  month, 
  weekNumber, 
  study, 
  clubReport,
  mode = "study",
  isReadOnly: initialIsReadOnly = false,
  isMentee,
  onRegenerateClubReport,
  onClose, 
  onSuccess 
}: StudyModalProps) {
  const isClubReportMode = mode === "clubReport";
  const fallbackFullContent = study?.fullContent ?? "";
  const readOnlyOwnContent = study?.ownContent || fallbackFullContent;
  const readOnlyClubContent = study?.clubContent ?? "";
  const reportContent = clubReport?.activityContent ?? "";
  const scheduleTitles = clubReport?.scheduleTitles ?? [];

  // 데이터가 없으면 작성 모드로 시작
  const [isReadOnly, setIsReadOnly] = useState(study ? initialIsReadOnly : false);
  const [title, setTitle] = useState(study?.title ?? "");
  const [ownContent, setOwnContent] = useState(study?.ownContent ?? fallbackFullContent);
  const [clubContent, setClubContent] = useState(study?.clubContent ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerateDisabled, setIsRegenerateDisabled] = useState(false);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [scheduleEvents, setScheduleEvents] = useState<Event[]>([]);
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

  useEffect(() => {
    if (!isClubReportMode || !clubReport || clubReport.scheduleIds.length === 0) {
      setIsScheduleLoading(false);
      setScheduleEvents([]);
      return;
    }

    const fetchScheduleEvents = async () => {
      setIsScheduleLoading(true);
      try {
        const schedules = await getEvent();
        const matchedSchedules = clubReport.scheduleIds
          .map((scheduleId) =>
            schedules.find((schedule) => Number(schedule.scheduleId) === Number(scheduleId)),
          )
          .filter((schedule): schedule is Event => Boolean(schedule));

        setScheduleEvents(matchedSchedules);
      } catch {
        setScheduleEvents([]);
      } finally {
        setIsScheduleLoading(false);
      }
    };

    fetchScheduleEvents();
  }, [clubReport, isClubReportMode]);

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
      toast.error("저장에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!study) return;

    setIsLoading(true);
    try {
      const id = study.studyId ?? (study as any).study_id;
      await deleteStudy(id);
      setIsDeleteConfirmOpen(false);
      onSuccess();
    } catch (e) {
      toast.error("삭제에 실패했어요.");
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

  const studyKebabItems = [
    {
      label: "수정",
      onClick: () => {
        setIsReadOnly(false);
      },
    },
    {
      label: "삭제",
      onClick: () => {
        setIsDeleteConfirmOpen(true);
      },
    },
  ];

  const handleRegenerateClick = async () => {
    if (!clubReport || !onRegenerateClubReport || isRegenerateDisabled) return;

    setIsRegenerateDisabled(true);
    const startedAt = Date.now();

    try {
      await onRegenerateClubReport(clubReport);
    } finally {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(3000 - elapsed, 0);

      window.setTimeout(() => {
        setIsRegenerateDisabled(false);
      }, remaining);
    }
  };

  return (
    <S.Overlay>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.TitleCancelContainer>
          {isClubReportMode ? (
            <S.Wrapper />
          ) : isReadOnly && study && isMentee ? (
            <S.KebabWrapper>
              <KebabMenu
                items={studyKebabItems}
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
            {isClubReportMode
              ? `${month}월 ${weekNumber}주차 종합 학습일지 조회`
              : `${month}월 ${weekNumber}주차 학습 일지 ${isReadOnly ? "조회" : study ? "수정" : "기록"}`}
          </S.Title>
          <S.Cancel src={cancelImg} onClick={onClose} />
        </S.TitleCancelContainer>

        {!isClubReportMode && (
          <S.StudyInputContainer>
            <S.StudyTitleInput
              placeholder={isReadOnly ? "" : "제목을 입력해 주세요."}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              readOnly={isReadOnly}
            />
            <S.StudyInputdivider />
          </S.StudyInputContainer>
        )}

        {isClubReportMode && !isScheduleLoading && scheduleTitles.length > 0 && (
          <S.ScheduleSection>
            <S.ScheduleList>
              {scheduleTitles.map((scheduleTitle, index) => {
                const scheduleEvent = scheduleEvents.find(
                  (event) =>
                    Number(event.scheduleId) === Number(clubReport?.scheduleIds[index]),
                );

                return (
                <S.ScheduleChip
                  key={`${scheduleTitle}-${index}`}
                  $backgroundColor={scheduleEvent?.color}
                >
                  <FaFlag size={12} style={{ flexShrink: 0 }} />
                  <S.ScheduleChipLabel>{scheduleTitle}</S.ScheduleChipLabel>
                </S.ScheduleChip>
              )})}
            </S.ScheduleList>
          </S.ScheduleSection>
        )}

        {isClubReportMode ? (
          <S.InputContainer>
            <S.InputBlock>
              <S.InputField
                value={reportContent}
                placeholder="작성된 내용이 없습니다."
                readOnly={true}
                $isReadOnly={true}
              />
            </S.InputBlock>
          </S.InputContainer>
        ) : (
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
        )}
        
        {isClubReportMode ? (
          <S.ButtonContainer>
            <S.Button
              onClick={handleRegenerateClick}
              disabled={isLoading || isRegenerateDisabled}
            >
              재생성
            </S.Button>
            <S.CancelButton onClick={onClose}>닫기</S.CancelButton>
          </S.ButtonContainer>
        ) : isReadOnly ? (
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
      <ConfirmModal
        open={isDeleteConfirmOpen}
        message="이 학습 일지를 삭제하시겠습니까?"
        cancelLabel="취소"
        confirmLabel="삭제"
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </S.Overlay>
  );
}
