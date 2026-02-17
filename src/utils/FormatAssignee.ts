export const formatAssignees = (assignees?: string[]): string => {
    if (!assignees || assignees.length === 0) return '-';
    if (assignees.length === 1) return assignees[0];
    return `${assignees[0]} 외 ${assignees.length - 1}명`;
  };