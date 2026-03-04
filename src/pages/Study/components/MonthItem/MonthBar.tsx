import { useState } from "react";
import * as S from "./MonthBar.styled";
import WeekItem from "./WeekItem";
import StudyModal from "../StudyModal/StudyModal";
import type { StudyResponse } from "../../../../api/Study";

interface MonthBarProps {
  month: number;
  studies: StudyResponse[];
  currentMonth: number;
  currentWeek: number;
}

export default function MonthBar({ month, studies, currentMonth, currentWeek }: MonthBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedStudy, setSelectedStudy] = useState<StudyResponse | null>(null);
  
  const isFutureMonth = month > currentMonth;

  const handleOpen = (weekNumber: number, study?: StudyResponse) => {
    setSelectedWeek(weekNumber);
    setSelectedStudy(study ?? null);
    setIsModalOpen(true);
  };

  return (
    <>
      <S.container>
      <S.MonthTitle isFuture={isFutureMonth}>{month}월</S.MonthTitle>
        <S.SortContainer>
          {[1, 2, 3, 4].map((weekNumber, index) => {
            const study = studies.find((s) => s.weekNumber === weekNumber);
            const isCurrentWeek = month === currentMonth && weekNumber === currentWeek;
            const isPast =
              month < currentMonth ||
              (month === currentMonth && weekNumber < currentWeek);

            return (
              <>
                <WeekItem
                  key={weekNumber}
                  weekNumber={weekNumber}
                  content={study?.content}
                  isCurrentWeek={isCurrentWeek}
                  isPast={isPast}
                  onAdd={() => handleOpen(weekNumber)}
                  onDetail={() => handleOpen(weekNumber, study)}
                />
                {index < 3 && <S.Divider />}
              </>
            );
          })}
        </S.SortContainer>
      </S.container>

      {isModalOpen && selectedWeek !== null && (
        <StudyModal
          month={month}
          weekNumber={selectedWeek}
          study={selectedStudy}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}