export function getStudyWeek(date: Date) {
  return Math.min(Math.ceil(date.getDate() / 7), 4);
}
