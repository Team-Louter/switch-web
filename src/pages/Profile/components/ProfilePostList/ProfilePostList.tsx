import { useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import * as S from '../../Profile.styled';
import { CATEGORY_REVERSED } from '@/constants/Community';
import { TAB_EMPTY_MESSAGES, PROFILE_TABS } from '@/constants/Profile';
import { formatDateTime } from '@/utils/FormatDate';
import ViewIcon from '@/assets/Mypage/View.svg';
import GoodIcon from '@/assets/Mypage/Good.svg';
import GoodEmptyIcon from '@/assets/Mypage/GoodEmpty.svg';
import ChatIcon from '@/assets/Mypage/Chat.svg';
import type { MainPost } from '@/types/post';

interface ProfilePostListProps {
  activeTab: number;
  onTabChange: (idx: number) => void;
  posts: MainPost[];
  loading: boolean;
  isFetchingMore: boolean;
  tabMeta: Record<
    number,
    { nextPage: number; hasMore: boolean; fetching: boolean }
  >;
  onFetchMore: (tab: number, page: number) => void;
}

export function ProfilePostList({
  activeTab,
  onTabChange,
  posts,
  loading,
  isFetchingMore,
  tabMeta,
  onFetchMore,
}: ProfilePostListProps) {
  const navigate = useNavigate();
  const tabContentRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* IntersectionObserver - sentinel이 보이면 다음 페이지 로드 */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = tabContentRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const meta = tabMeta[activeTab];
        if (!meta || !meta.hasMore || meta.fetching) return;
        onFetchMore(activeTab, meta.nextPage);
      },
      { root: container, threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [activeTab, tabMeta, onFetchMore]);

  return (
    <>
      {/* 탭 */}
      <S.TabBar>
        {PROFILE_TABS.map((tab, idx) => (
          <S.TabItem
            key={tab}
            $active={activeTab === idx}
            onClick={() => onTabChange(idx)}
          >
            {tab}
            <S.TabIndicator $active={activeTab === idx} />
          </S.TabItem>
        ))}
      </S.TabBar>

      {/* 글 목록 */}
      <S.TabContent ref={tabContentRef}>
        {loading ? (
          <S.PostList>
            {Array.from({ length: 5 }).map((_, i) => (
              <S.PostItem key={i} style={{ cursor: 'default' }}>
                <S.PostLeft>
                  <Skeleton width={56} height={22} borderRadius={50} />
                  <Skeleton width={260} height={16} />
                </S.PostLeft>
                <S.PostMeta>
                  <Skeleton width={40} height={14} />
                  <Skeleton width={40} height={14} />
                  <Skeleton width={40} height={14} />
                  <Skeleton width={80} height={14} />
                </S.PostMeta>
              </S.PostItem>
            ))}
          </S.PostList>
        ) : posts.length === 0 ? (
          <S.EmptyMessage>{TAB_EMPTY_MESSAGES[activeTab]}</S.EmptyMessage>
        ) : (
          <S.PostList>
            {posts.map((post) => (
              <S.PostItem
                key={
                  activeTab === 1
                    ? `${post.postId}-${post.commentId ?? post.postId}`
                    : post.postId
                }
                onClick={() => navigate(`/community/${post.postId}`)}
              >
                <S.PostLeft>
                  <S.CategoryBadge>
                    {CATEGORY_REVERSED[post.postCategory] ?? post.postCategory}
                  </S.CategoryBadge>
                  <div style={{ overflow: 'hidden' }}>
                    <S.PostTitle>{post.postTitle}</S.PostTitle>
                    {activeTab === 1 && post.commentContent && (
                      <S.CommentContent>
                        └ {post.commentContent}
                      </S.CommentContent>
                    )}
                  </div>
                </S.PostLeft>
                <S.PostMeta>
                  <S.MetaItem>
                    <img src={ViewIcon} alt="views" />
                    {post.viewers.toLocaleString()}
                  </S.MetaItem>
                  <S.MetaItem $red>
                    <img
                      src={
                        activeTab === 2 || post.isHearted
                          ? GoodIcon
                          : GoodEmptyIcon
                      }
                      alt="likes"
                    />
                    {post.likeCount.toLocaleString()}
                  </S.MetaItem>
                  <S.MetaItem $yellow>
                    <img src={ChatIcon} alt="comments" />
                    {post.commentCount.toLocaleString()}
                  </S.MetaItem>
                  <S.MetaItem>
                    {formatDateTime(post.commentCreatedAt ?? post.createdAt)}
                  </S.MetaItem>
                </S.PostMeta>
              </S.PostItem>
            ))}
            {/* 무한 스크롤 sentinel */}
            <div ref={sentinelRef} style={{ height: 1 }} />
            {isFetchingMore &&
              Array.from({ length: 3 }).map((_, i) => (
                <S.PostItem
                  key={`skeleton-more-${i}`}
                  style={{ cursor: 'default' }}
                >
                  <S.PostLeft>
                    <Skeleton width={56} height={22} borderRadius={50} />
                    <Skeleton width={260} height={16} />
                  </S.PostLeft>
                  <S.PostMeta>
                    <Skeleton width={40} height={14} />
                    <Skeleton width={40} height={14} />
                    <Skeleton width={40} height={14} />
                    <Skeleton width={80} height={14} />
                  </S.PostMeta>
                </S.PostItem>
              ))}
          </S.PostList>
        )}
      </S.TabContent>
    </>
  );
}
