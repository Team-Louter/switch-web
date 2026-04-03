import CommonCalendar from "@/components/common/Calendar/Calendar";
import type { EventInput } from "@fullcalendar/core";
import cancelImg from "@/assets/cancel.png";
import * as S from "./ClubReportCreateModal.styled";

interface ClubReportCreateModalProps {
  initialDate: Date;
  selectedEvents: EventInput[];
  isSubmitting: boolean;
  onSelectionToggle: (event: EventInput) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ClubReportCreateModal({
  initialDate,
  selectedEvents,
  isSubmitting,
  onSelectionToggle,
  onClose,
  onSubmit,
}: ClubReportCreateModalProps) {
  const monthLabel = initialDate.getMonth() + 1;
  const selectedScheduleIds = selectedEvents
    .map((event) => event.scheduleId ?? event.extendedProps?.scheduleId)
    .filter((scheduleId): scheduleId is number => typeof scheduleId === "number");

  return (
    <S.Overlay>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.TitleGroup>
            <S.Title>종합 학습일지 생성 ({monthLabel}월)</S.Title>
          </S.TitleGroup>
          <S.CloseButton src={cancelImg} onClick={onClose} />
        </S.Header>

        <S.CalendarSection>
          <CommonCalendar
            readOnly={true}
            initialDate={initialDate}
            selectionMode="clubReport"
            selectedScheduleIds={selectedScheduleIds}
            showHeaderToolbar={false}
            onSelectionToggle={onSelectionToggle}
          />
        </S.CalendarSection>

        <S.Footer>
          <S.PrimaryButton
            onClick={onSubmit}
            disabled={selectedEvents.length === 0 || isSubmitting}
          >
            완료
          </S.PrimaryButton>
        </S.Footer>
      </S.Container>
    </S.Overlay>
  );
}
