import { useCallback, useEffect, useState } from "react";
import Post from "../components/StudyPost/StudyPost";
import * as S from "./StudyMentor.style.ts";
import { getStudies, type StudyResponse } from "@/api/study";
import {
  createClubReport,
  getClubReports,
  regenerateClubReport,
  type ClubReportResponse,
} from "@/api/clubReport";
import LeftArrow from "@/assets/study/Arrow.png";
import StudyAddButton from "@/assets/study/studyAdd.png";
import StudyModal from "../components/StudyModal/StudyModal";
import { getUser } from "@/api/user";
import { getStudyPeriod, getStudyWeeksInMonth } from "@/utils/getStudyWeek";
import type { EventInput } from "@fullcalendar/core";
import ClubReportCreateModal from "../components/ClubReportCreateModal/ClubReportCreateModal";
import { toast } from "@/store/toastStore";

function StudyMentorSkeleton() {
  return (
    <S.PostGrid>
      {Array.from({ length: 6 }, (_, index) => (
        <S.SkeletonPost key={`study-mentor-skeleton-${index}`}>
          <S.SkeletonAuthor />
          <S.SkeletonCard>
            <S.SkeletonTitle />
            <S.SkeletonContent />
            <S.SkeletonContentShort />
            <S.SkeletonButton />
          </S.SkeletonCard>
        </S.SkeletonPost>
      ))}
    </S.PostGrid>
  );
}

export default function StudyMentor() {
  const [studies, setStudies] = useState<StudyResponse[]>([]);
  const [clubReports, setClubReports] = useState<ClubReportResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudy, setSelectedStudy] = useState<StudyResponse | null>(null);
  const [selectedClubReport, setSelectedClubReport] = useState<ClubReportResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedScheduleEvents, setSelectedScheduleEvents] = useState<EventInput[]>([]);
  const [isCreatingClubReport, setIsCreatingClubReport] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // 현재 날짜 기준 초기 값 설정
  const today = new Date();
  const currentStudyPeriod = getStudyPeriod(today);
  const [viewYear, setViewYear] = useState(currentStudyPeriod.year);
  const [viewMonth, setViewMonth] = useState(currentStudyPeriod.month);
  const [viewWeek, setViewWeek] = useState(currentStudyPeriod.weekNumber);
  const weeksInViewMonth = getStudyWeeksInMonth(viewYear, viewMonth);

  const getResolvedStudyMonth = (study: any) => {
    const studyMonth = study.month ?? study.month_number ?? study.monthNumber;

    if (studyMonth !== undefined) {
      return Number(studyMonth);
    }

    if (study.createdAt) {
      return getStudyPeriod(new Date(study.createdAt)).month;
    }

    return NaN;
  };

  const getResolvedStudyWeek = (study: any) => {
    const studyWeek = study.weekNumber ?? study.week_number ?? study.week;

    if (studyWeek !== undefined) {
      return Number(studyWeek);
    }

    if (study.createdAt) {
      return getStudyPeriod(new Date(study.createdAt)).weekNumber;
    }

    return NaN;
  };

  const getStudyAuthorKey = (study: any) => {
    const authorName = study.authorName ?? study.author_name;

    if (typeof authorName === "string" && authorName.trim() !== "") {
      return authorName.trim();
    }

    return `unknown-${study.studyId ?? study.study_id ?? study.createdAt ?? Math.random()}`;
  };

  const getStudySortValue = (study: any) => {
    const studyId = Number(study.studyId ?? study.study_id);

    if (Number.isFinite(studyId)) {
      return studyId;
    }

    const createdAt = Date.parse(study.createdAt ?? "");
    return Number.isFinite(createdAt) ? createdAt : 0;
  };

  const fetchAllStudies = useCallback(async () => {
    setIsLoading(true);
    try {
      const [studyData, clubReportData] = await Promise.all([
        getStudies(),
        getClubReports(),
      ]);
      const studyList = Array.isArray(studyData) ? studyData : (studyData as any).content || [];
      const reportList = Array.isArray(clubReportData)
        ? clubReportData
        : (clubReportData as any).content || [];
      setStudies(studyList);
      setClubReports(reportList);
    } catch (error) {
      console.error("학습일지를 불러오는데 실패했습니다.", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStudies();

    const fetchUserRole = async () => {
      try {
        const userData = await getUser();
        setRole(userData.role);
      } catch (error) {
        console.error("역할 정보를 가져오는데 실패했습니다.", error);
      }
    };
    fetchUserRole();
  }, [fetchAllStudies]);

  // 주차 이동
  const handlePrevWeek = () => {
    if (viewWeek > 1) {
      setViewWeek(viewWeek - 1);
    } else {
      const prevMonth = viewMonth === 1 ? 12 : viewMonth - 1;
      const prevYear = viewMonth === 1 ? viewYear - 1 : viewYear;
      setViewYear(prevYear);
      setViewMonth(prevMonth);
      setViewWeek(getStudyWeeksInMonth(prevYear, prevMonth));
    }
  };

  const handleNextWeek = () => {
    if (viewWeek < weeksInViewMonth) {
      setViewWeek(viewWeek + 1);
    } else {
      const nextMonth = viewMonth === 12 ? 1 : viewMonth + 1;
      const nextYear = viewMonth === 12 ? viewYear + 1 : viewYear;
      setViewYear(nextYear);
      setViewMonth(nextMonth);
      setViewWeek(1);
    }
  };

  const handleOpenDetail = (study: StudyResponse) => {
    setSelectedClubReport(null);
    setSelectedStudy(study);
    setIsModalOpen(true);
  };

  const handleOpenClubReport = () => {
    setSelectedStudy(null);
    setSelectedClubReport(currentClubReport ?? null);
    setIsModalOpen(true);
  };

  const handleOpenCreateClubReport = () => {
    setSelectedScheduleEvents([]);
    setIsCreateModalOpen(true);
  };

  const handleRegenerateClubReport = async (clubReport: ClubReportResponse) => {
    setIsCreatingClubReport(true);

    try {
      const regeneratedReport = await regenerateClubReport(clubReport.clubReportId);

      setClubReports((prev) => {
        const filtered = prev.filter(
          (report) => Number(report.clubReportId) !== Number(clubReport.clubReportId),
        );
        return [...filtered, regeneratedReport];
      });
      setSelectedClubReport(regeneratedReport);
    } catch (error) {
      toast.error("종합 학습일지 재생성에 실패했어요.");
    } finally {
      setIsCreatingClubReport(false);
    }
  };

  const handleToggleSelectedScheduleEvent = (event: EventInput) => {
    const scheduleId = Number(event.scheduleId ?? event.extendedProps?.scheduleId);

    if (!Number.isFinite(scheduleId) || scheduleId < 0) {
      return;
    }

    if (!event.start) {
      return;
    }

    const eventDate = new Date(event.start);
    const isSameMonth = eventDate.getMonth() + 1 === viewMonth;

    if (!isSameMonth) {
      toast.warning(`${viewMonth}월 일정만 선택할 수 있어요.`);
      return;
    }

    setSelectedScheduleEvents((prev) => {
      const isAlreadySelected = prev.some(
        (selectedEvent) =>
          Number(selectedEvent.scheduleId ?? selectedEvent.extendedProps?.scheduleId) === scheduleId,
      );

      if (isAlreadySelected) {
        return prev.filter(
          (selectedEvent) =>
            Number(selectedEvent.scheduleId ?? selectedEvent.extendedProps?.scheduleId) !== scheduleId,
        );
      }

      return [...prev, event];
    });
  };

  const handleCreateClubReport = async () => {
    if (selectedScheduleEvents.length === 0) {
      toast.warning("일정을 먼저 선택해 주세요.");
      return;
    }
    const scheduleIds = selectedScheduleEvents
      .map((event) => event.scheduleId ?? event.extendedProps?.scheduleId)
      .filter((scheduleId): scheduleId is number => typeof scheduleId === "number");

    if (scheduleIds.length === 0) {
      toast.error("선택한 일정의 ID를 확인할 수 없어요.");
      return;
    }

    setIsCreatingClubReport(true);

    try {
      const createdReport = await createClubReport({
        scheduleIds,
        month: viewMonth,
        weekNumber: viewWeek,
      });

      setClubReports((prev) => {
        const filtered = prev.filter(
          (report) =>
            !(
              Number(report.month) === Number(createdReport.month) &&
              Number(report.weekNumber) === Number(createdReport.weekNumber)
            ),
        );
        return [...filtered, createdReport];
      });
      setSelectedStudy(null);
      setSelectedClubReport(createdReport);
      setIsCreateModalOpen(false);
      setSelectedScheduleEvents([]);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("종합 학습일지 생성에 실패했어요.");
    } finally {
      setIsCreatingClubReport(false);
    }
  };

  // 현재 선택된 월/주차에 해당하는 데이터 필터링
  const filteredStudies = Array.from(
    studies
      .filter((study: any) => {
        const studyMonth = getResolvedStudyMonth(study);
        const studyWeek = getResolvedStudyWeek(study);

        return Number(studyMonth) === Number(viewMonth) && Number(studyWeek) === Number(viewWeek);
      })
      .reduce((acc, study: any) => {
        const authorKey = getStudyAuthorKey(study);
        const existingStudy = acc.get(authorKey);

        if (!existingStudy || getStudySortValue(study) > getStudySortValue(existingStudy)) {
          acc.set(authorKey, study);
        }

        return acc;
      }, new Map<string, StudyResponse>())
      .values(),
  );

  const currentClubReport = clubReports.find(
    (report) =>
      Number(report.month) === Number(viewMonth) &&
      Number(report.weekNumber) === Number(viewWeek),
  );
  const isClubReportModal = selectedClubReport !== null || selectedStudy === null;

  return (
    <S.Container>
      <S.NavHeader>
        <S.NavSide />
        <S.NavCenter>
          <S.NavButton onClick={handlePrevWeek}>
            <img src={LeftArrow} alt="이전" style={{ transform: "rotate(0deg)" }} />
          </S.NavButton>
          <S.NavTitle>{viewMonth}월 {viewWeek}주차</S.NavTitle>
          <S.NavButton onClick={handleNextWeek}>
            <img src={LeftArrow} alt="다음" style={{ transform: "rotate(180deg)" }} />
          </S.NavButton>
        </S.NavCenter>
        <S.NavSide>
          {currentClubReport ? (
            <S.ReportDetailButton onClick={handleOpenClubReport}>종합 학습일지</S.ReportDetailButton>
          ) : (
            <>
              <S.ReportLabelButton onClick={handleOpenClubReport}>
                종합 학습일지
              </S.ReportLabelButton>
              <S.ReportAddButton
                src={StudyAddButton}
                alt="종합 학습일지 생성"
                onClick={handleOpenCreateClubReport}
              />
            </>
          )}
        </S.NavSide>
      </S.NavHeader>

      {isLoading ? (
        <StudyMentorSkeleton />
      ) : filteredStudies.length > 0 ? (
        <S.PostGrid>
          {filteredStudies.map((study) => (
            <Post 
              key={study.studyId || (study as any).study_id} 
              study={study} 
              onDetail={handleOpenDetail}
            />
          ))}
        </S.PostGrid>
      ) : (
        <S.EmptyState>학습 일지가 없어요.</S.EmptyState>
      )}

      {isModalOpen && (selectedStudy || isClubReportModal) && (
        <StudyModal
          month={viewMonth}
          weekNumber={viewWeek}
          study={selectedStudy}
          clubReport={selectedClubReport}
          mode={selectedStudy ? "study" : "clubReport"}
          isReadOnly={true}
          isMentee={role === "MENTEE"}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedStudy(null);
            setSelectedClubReport(null);
          }}
          onRegenerateClubReport={handleRegenerateClubReport}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedStudy(null);
            setSelectedClubReport(null);
            fetchAllStudies();
          }}
        />
      )}

      {isCreateModalOpen && (
        <ClubReportCreateModal
          initialDate={new Date(viewYear, viewMonth - 1, 1)}
          selectedEvents={selectedScheduleEvents}
          isSubmitting={isCreatingClubReport}
          onSelectionToggle={handleToggleSelectedScheduleEvent}
          onClose={() => {
            if (isCreatingClubReport) return;
            setIsCreateModalOpen(false);
            setSelectedScheduleEvents([]);
          }}
          onSubmit={handleCreateClubReport}
        />
      )}
    </S.Container>
  );
}
