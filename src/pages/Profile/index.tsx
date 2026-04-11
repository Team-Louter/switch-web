import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import * as S from './_Profile.style.ts';
import { useAuthStore } from '@/store/authStore';
import { logout } from '@/api/auth';
import { getUser } from '@/api/user';
import { toast } from '@/store/toastStore';
import type { User } from '@/types/user';
import WithdrawModal from './components/WithdrawModal/WithdrawModal';
import EditProfileModal from './components/EditProfileModal/EditProfileModal';
import MemberManageModal from './components/MemberManageModal/MemberManageModal';
import { ProfileHeader } from './components/ProfileHeader/ProfileHeader';
import { ProfilePostList } from './components/ProfilePostList/ProfilePostList';
import { useProfileTabs } from './hooks/useProfileTabs';

export default function Profile() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const [user, setUser] = useState<User | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const {
    activeTab,
    setActiveTab,
    posts,
    loading,
    isFetchingMore,
    tabMeta,
    fetchPage,
  } = useProfileTabs();

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch(() => toast.error('사용자 정보 조회 실패'));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      clearAuth();
      toast.success('로그아웃 성공');
      navigate('/auth/signin');
    }
  };

  return (
    <S.Container>
      <S.PageWrapper>
        <SkeletonTheme baseColor="#F3F4F6" highlightColor="#e8e8e8">
          <S.Inner>
            <S.Card>
              <ProfileHeader
                user={user}
                onEditClick={() => setShowEditModal(true)}
                onLogoutClick={handleLogout}
                onWithdrawClick={() => setShowWithdrawModal(true)}
                onMemberManageClick={() => setShowMemberModal(true)}
              />

              <ProfilePostList
                activeTab={activeTab}
                onTabChange={setActiveTab}
                posts={posts}
                loading={loading}
                isFetchingMore={isFetchingMore}
                tabMeta={tabMeta}
                onFetchMore={fetchPage}
              />
            </S.Card>
          </S.Inner>
        </SkeletonTheme>

        {showWithdrawModal && (
          <WithdrawModal onClose={() => setShowWithdrawModal(false)} />
        )}
        {showEditModal && user && (
          <EditProfileModal
            user={user}
            onClose={() => setShowEditModal(false)}
            onUpdated={(updated) => setUser(updated)}
          />
        )}
        {showMemberModal && (
          <MemberManageModal onClose={() => setShowMemberModal(false)} />
        )}
      </S.PageWrapper>
    </S.Container>
  );
}
