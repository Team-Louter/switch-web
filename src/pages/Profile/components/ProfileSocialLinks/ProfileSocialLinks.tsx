import * as S from '../../Profile.style.ts';
import {
  normalizeGithubUrl,
  normalizeLinkedinUrl,
  extractGithubHandle,
  extractLinkedinHandle,
} from '../../utils/profileUrlUtils';
import GithubImg from '@/assets/Mypage/github.svg';
import LinkedinImg from '@/assets/Mypage/linkedin.svg';

interface ProfileSocialLinksProps {
  githubUrl?: string;
  linkedinUrl?: string;
}

export function ProfileSocialLinks({
  githubUrl,
  linkedinUrl,
}: ProfileSocialLinksProps) {
  if (!githubUrl && !linkedinUrl) return null;

  return (
    <S.SocialRow>
      {githubUrl && (
        <S.SocialLink
          href={normalizeGithubUrl(githubUrl)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={GithubImg} alt="GitHub" width={18} height={18} />
          {extractGithubHandle(githubUrl)}
        </S.SocialLink>
      )}
      {linkedinUrl && (
        <S.SocialLink
          href={normalizeLinkedinUrl(linkedinUrl)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={LinkedinImg} alt="LinkedIn" width={18} height={18} />
          {extractLinkedinHandle(linkedinUrl)}
        </S.SocialLink>
      )}
    </S.SocialRow>
  );
}
