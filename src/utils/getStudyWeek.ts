const SATURDAY = 6;
const FRIDAY = 5;

function getSaturdayOffset(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  return (firstDayOfMonth - SATURDAY + 7) % 7;
}

export function getStudyStart(date: Date) {
  const start = new Date(date);
  const daysSinceSaturday = (start.getDay() - SATURDAY + 7) % 7;
  start.setDate(start.getDate() - daysSinceSaturday);
  return start;
}

export function getStudyEnd(date: Date) {
  const end = new Date(date);
  const daysUntilFriday = (FRIDAY - end.getDay() + 7) % 7;
  end.setDate(end.getDate() + daysUntilFriday);
  return end;
}

export function getStudyPeriod(date: Date) {
  const weekStart = getStudyStart(date);
  const year = weekStart.getFullYear();
  const month = weekStart.getMonth() + 1;
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const calendarStart = new Date(firstDayOfMonth);
  const daysSinceSaturday = getSaturdayOffset(year, month);
  calendarStart.setDate(calendarStart.getDate() - daysSinceSaturday);
  const diffTime = weekStart.getTime() - calendarStart.getTime();
  const weekNumber = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000)) + 1;

  return {
    year,
    month,
    weekNumber,
    start: weekStart,
    end: getStudyEnd(date),
  };
}

export function getStudyWeek(date: Date) {
  return getStudyPeriod(date).weekNumber;
}

export function getStudyWeeksInMonth(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const calendarStart = new Date(firstDayOfMonth);
  const daysSinceSaturday = getSaturdayOffset(year, month);
  calendarStart.setDate(calendarStart.getDate() - daysSinceSaturday);

  const lastDayOfMonth = new Date(year, month, 0);
  const lastWeekStart = getStudyStart(lastDayOfMonth);
  const diffTime = lastWeekStart.getTime() - calendarStart.getTime();

  return Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000)) + 1;
}
