import { useCallback, useEffect, useRef, useState } from "react";
import * as S from "./StudyMain.style.ts";
import MonthBar from "../components/MonthItem/MonthBar";
import { getMyStudies, type StudyResponse } from "@/api/study";
import { getStudyPeriod, getStudyWeeksInMonth } from "@/utils/getStudyWeek";

const MONTHS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const today = new Date();
const currentStudyPeriod = getStudyPeriod(today);
const currentYear = currentStudyPeriod.year;
const currentMonth = currentStudyPeriod.month;
const currentWeek = currentStudyPeriod.weekNumber;

export function StudyMainSkeleton() {
  return (
    <S.SkeletonContainer>
      {MONTHS.map((month) => (
        <S.SkeletonMonthSection key={`skeleton-${month}`}>
          <S.SkeletonMonthCard>
            {Array.from(
              { length: getStudyWeeksInMonth(currentYear, month) },
              (_, index) => index + 1,
            ).map((weekNumber) => (
              <S.SkeletonWeekBlock
                key={`${month}-${weekNumber}`}
                $weekCount={getStudyWeeksInMonth(currentYear, month)}
              >
                <S.SkeletonWeekLabel />
                <S.SkeletonWeekContent />
              </S.SkeletonWeekBlock>
            ))}
          </S.SkeletonMonthCard>
        </S.SkeletonMonthSection>
      ))}
    </S.SkeletonContainer>
  );
}

export default function StudyMain() {
  const [studies, setStudies] = useState<StudyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startY.current = e.clientY;
    scrollTop.current = scrollRef.current.scrollTop;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const walk = e.clientY - startY.current;
    scrollRef.current.scrollTop = scrollTop.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const fetchStudies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyStudies();
      let studyList: StudyResponse[] = [];
      if (Array.isArray(response)) {
        studyList = response;
      } else if (response && typeof response === 'object') {
        const anyResponse = response as any;
        studyList = anyResponse.data || anyResponse.content || anyResponse.studies || [];
      }
      
      setStudies(studyList);
    } catch (e) {
      setError("스터디 정보를 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  if (isLoading) return <StudyMainSkeleton />;
  if (error) return <div>{error}</div>;

  return (
    <S.container
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {MONTHS.map((month) => (
        <MonthBar
          key={month}
          month={month}
          studies={studies.filter((s: any) => {
            let sYear = s.year;
            if ((sYear === undefined || sYear === null) && s.createdAt) {
              sYear = getStudyPeriod(new Date(s.createdAt)).year;
            }
            // month 필드가 있으면 우선 사용, 없으면 제출 주간 기준으로 계산 (최후의 수단)
            let sMonth = s.month ?? s.month_number ?? s.monthNumber;
            if (sMonth === undefined && s.createdAt) {
              sMonth = getStudyPeriod(new Date(s.createdAt)).month;
            }
            return Number(sYear) === Number(currentYear) && Number(sMonth) === Number(month);
          })}
          currentMonth={currentMonth}
          currentWeek={currentWeek}
          currentYear={currentYear}
          onStudyChange={fetchStudies}
        />
      ))}
    </S.container>
  );
}
