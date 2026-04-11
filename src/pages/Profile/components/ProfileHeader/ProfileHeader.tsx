import Skeleton from 'react-loading-skeleton';
import * as S from '../../_Profile.style.ts';
import { ProfileSocialLinks } from '../ProfileSocialLinks/ProfileSocialLinks';
import type { User } from '@/types/user';

interface ProfileHeaderProps {
  user: User | null;
  onEditClick: () => void;
  onLogoutClick: () => void;
  onWithdrawClick: () => void;
  onMemberManageClick: () => void;
}

export function ProfileHeader({
  user,
  onEditClick,
  onLogoutClick,
  onWithdrawClick,
  onMemberManageClick,
}: ProfileHeaderProps) {
  if (user === null) {
    return (
      <S.CardTop>
        <S.ProfileGroup>
          <Skeleton circle width={116} height={116} />
          <S.ProfileInfo>
            <Skeleton width={120} height={22} />
            <Skeleton width={160} height={16} />
            <Skeleton width={80} height={28} borderRadius={4} />
          </S.ProfileInfo>
        </S.ProfileGroup>
        <S.StatsGroup>
          {[0, 1, 2].map((i) => (
            <S.StatItem key={i}>
              <Skeleton width={40} height={24} />
              <Skeleton width={72} height={14} style={{ marginTop: 8 }} />
            </S.StatItem>
          ))}
        </S.StatsGroup>
        <S.ActionGroup>
          <Skeleton width={80} height={34} borderRadius={4} />
          <Skeleton width={80} height={34} borderRadius={4} />
        </S.ActionGroup>
      </S.CardTop>
    );
  }

  return (
    <>
      <S.CardTop>
        <S.ProfileGroup>
          <S.ProfileImageWrapper>
            {user.profileImageUrl ? (
              <S.ProfileImage src={user.profileImageUrl} alt="프로필 이미지" />
            ) : (
              <S.ProfileImageFallback>
                {user.userName.charAt(0)}
              </S.ProfileImageFallback>
            )}
          </S.ProfileImageWrapper>
          <S.ProfileInfo>
            <S.ProfileName>{user.userName}</S.ProfileName>
            <S.ProfileSubInfo>
              {`${user.grade}학년 ${user.classRoom}반 ${user.number}번`}
            </S.ProfileSubInfo>
            <S.EditButton onClick={onEditClick}>프로필 수정</S.EditButton>
          </S.ProfileInfo>
        </S.ProfileGroup>

        <S.StatsGroup>
          <S.StatItem>
            <S.StatValue>{user.postCount}</S.StatValue>
            <S.StatLabel>작성한 글</S.StatLabel>
          </S.StatItem>
          <S.StatItem>
            <S.StatValue>{user.commentCount}</S.StatValue>
            <S.StatLabel>작성한 댓글</S.StatLabel>
          </S.StatItem>
          <S.StatItem>
            <S.StatValue>{user.likedPostCount}</S.StatValue>
            <S.StatLabel>좋아요한 글</S.StatLabel>
          </S.StatItem>
        </S.StatsGroup>

        <S.ActionGroup>
          <ProfileSocialLinks
            githubUrl={user.githubUrl}
            linkedinUrl={user.linkedinUrl}
          />
          <S.ButtonRow>
            {user.role === 'LEADER' && (
              <S.ActionButton $variant="admin" onClick={onMemberManageClick}>
                멤버 관리
              </S.ActionButton>
            )}
            <S.ActionButton onClick={onLogoutClick}>로그아웃</S.ActionButton>
            <S.ActionButton $danger onClick={onWithdrawClick}>
              회원 탈퇴
            </S.ActionButton>
          </S.ButtonRow>
        </S.ActionGroup>
      </S.CardTop>

      <S.Divider />

      <S.InfoSection>
        <S.InfoRow>
          <S.InfoLabel>이메일(Email)</S.InfoLabel>
          <S.InfoValue>{user.userEmail}</S.InfoValue>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoLabel>받은 좋아요 개수</S.InfoLabel>
          <S.InfoValue $accent>
            {user.receivedLikeCount.toLocaleString()}
          </S.InfoValue>
        </S.InfoRow>
      </S.InfoSection>
    </>
  );
}
