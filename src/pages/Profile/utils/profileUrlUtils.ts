export const normalizeGithubUrl = (url: string) => {
  const parts = url.split('github.com/').filter(Boolean);
  return parts.length > 0
    ? `https://github.com/${parts[parts.length - 1].split('/')[0]}`
    : url;
};

export const normalizeLinkedinUrl = (url: string) => {
  const parts = url.split(/linkedin\.com\/in\//i).filter(Boolean);
  return parts.length > 0
    ? `https://www.linkedin.com/in/${parts[parts.length - 1].split('/')[0]}`
    : url;
};

export const extractGithubHandle = (url: string) => {
  const parts = url.split('github.com/').filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1].split('/')[0] : '';
};

export const extractLinkedinHandle = (url: string) => {
  const parts = url.split(/linkedin\.com\/in\//i).filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1].split('/')[0] : '';
};
