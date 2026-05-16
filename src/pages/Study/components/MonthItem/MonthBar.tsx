import { useState } from "react";
import * as S from "./MonthBar.style.ts";
import WeekItem from "./WeekItem";
import StudyModal from "../StudyModal/StudyModal";
import type { StudyResponse } from "@/api/study";
import { getStudyPeriod, getStudyWeeksInMonth } from "@/utils/getStudyWeek";

interface MonthBarProps {
  month: number;
  studies: StudyResponse[];
  currentMonth: number;
  currentWeek: number;
  currentYear: number;
  onStudyChange: () => void;
}

export default function MonthBar({
  month,
  studies,
  currentMonth,
  currentWeek,
  currentYear,
  onStudyChange,
}: MonthBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedStudy, setSelectedStudy] = useState<StudyResponse | null>(null);

  const isFutureMonth = month > currentMonth;
  const weekCount = getStudyWeeksInMonth(currentYear, month);
  const weekNumbers = Array.from({ length: weekCount }, (_, index) => index + 1);

  const handleOpen = (weekNumber: number, study?: StudyResponse) => {
    setSelectedWeek(weekNumber);
    setSelectedStudy(study ?? null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <S.container>
        <S.MonthTitle $isFuture={isFutureMonth}>{month}월</S.MonthTitle>
        <S.SortContainer $weekCount={weekCount}>
          {weekNumbers.map((weekNumber) => {
            // 해당 주차의 일지 중 가장 최근 것(id가 큰 것)을 찾음
            const study = studies
              .filter((s: any) => {
                let sWeek = s.weekNumber ?? s.week_number ?? s.week;
                // 만약 week 정보가 아예 없다면 제출 주간 기준으로 계산 (최후의 수단)
                if (sWeek === undefined && s.createdAt) {
                  sWeek = getStudyPeriod(new Date(s.createdAt)).weekNumber;
                }
                return Number(sWeek) === Number(weekNumber);
              })
              .sort((a: any, b: any) => {
                const aId = a.studyId ?? a.study_id ?? 0;
                const bId = b.studyId ?? b.study_id ?? 0;
                return Number(bId) - Number(aId);
              })[0];

            const isCurrentWeek = Number(month) === Number(currentMonth) && Number(weekNumber) === Number(currentWeek);
            const isPast =
              Number(month) < Number(currentMonth) ||
              (Number(month) === Number(currentMonth) && Number(weekNumber) < Number(currentWeek));

            return (
              <WeekItem
                key={weekNumber}
                weekNumber={weekNumber}
                weekCount={weekCount}
                title={study?.title} 
                isCurrentWeek={isCurrentWeek}
                isPast={isPast}
                onAdd={() => handleOpen(weekNumber)}
                onDetail={() => handleOpen(weekNumber, study)}
              />
            );
          })}
        </S.SortContainer>
      </S.container>

      {isModalOpen && selectedWeek !== null && (
        <StudyModal
          month={month}
          weekNumber={selectedWeek}
          study={selectedStudy}
          isReadOnly={true}
          isMentee={true}
          onClose={handleClose}
          onSuccess={() => {
            handleClose();
            onStudyChange();
          }}
        />
      )}
    </>
  );
}
