const MONDAY = 1;
const SUNDAY = 0;

function getMondayOffset(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  return (firstDayOfMonth - MONDAY + 7) % 7;
}

export function getStudyStart(date: Date) {
  const start = new Date(date);
  const daysSinceMonday = (start.getDay() - MONDAY + 7) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  return start;
}

export function getStudyEnd(date: Date) {
  const end = new Date(date);
  const daysUntilSunday = (SUNDAY - end.getDay() + 7) % 7;
  end.setDate(end.getDate() + daysUntilSunday);
  return end;
}

export function getStudyPeriod(date: Date) {
  const weekEnd = getStudyEnd(date);
  const year = weekEnd.getFullYear();
  const month = weekEnd.getMonth() + 1;
  const mondayOffset = getMondayOffset(year, month);
  const weekNumber = Math.ceil((weekEnd.getDate() + mondayOffset) / 7);

  return {
    year,
    month,
    weekNumber,
    start: getStudyStart(date),
    end: weekEnd,
  };
}

export function getStudyWeek(date: Date) {
  return getStudyPeriod(date).weekNumber;
}

export function getStudyWeeksInMonth(year: number, month: number) {
  const mondayOffset = getMondayOffset(year, month);
  const lastDateOfMonth = new Date(year, month, 0).getDate();
  return Math.ceil((lastDateOfMonth + mondayOffset) / 7);
}
