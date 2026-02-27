export const formatAssignees = (assignees?: { userName: string }[] | string[]): string => {
  if (!assignees || assignees.length === 0) return '-';
  
  const names = assignees.map(a => typeof a === 'string' ? a : a.userName);
  
  if (names.length === 1) return names[0];
  return `${names[0]} 외 ${names.length - 1}명`;
};