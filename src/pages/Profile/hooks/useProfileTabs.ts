import { useState, useEffect, useCallback } from 'react';
import { useLikeStore } from '@/store/likeStore';
import { getMyPost, getCommentedPost, getLikedPost } from '@/api/user';
import type { MainPost } from '@/types/post';
import { PROFILE_PAGE_SIZE } from '@/constants/Profile';

const PAGE_SIZE = PROFILE_PAGE_SIZE;
const FETCH_FNS = [getMyPost, getCommentedPost, getLikedPost] as const;

type TabMeta = { nextPage: number; hasMore: boolean; fetching: boolean };

export const useProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tabCache, setTabCache] = useState<Record<number, MainPost[]>>({});
  const [tabMeta, setTabMeta] = useState<Record<number, TabMeta>>({});

  const dedup = useCallback((tab: number, items: MainPost[]): MainPost[] => {
    const seen = new Set<string>();
    return items.filter((post) => {
      const uid =
        tab === 1
          ? `${post.postId}-${post.commentId ?? post.postId}`
          : String(post.postId);
      if (seen.has(uid)) return false;
      seen.add(uid);
      return true;
    });
  }, []);

  const fetchPage = useCallback(
    async (tab: number, page: number, signal?: AbortSignal) => {
      setTabMeta((prev) => ({
        ...prev,
        [tab]: {
          ...(prev[tab] ?? { nextPage: 0, hasMore: true }),
          fetching: true,
        },
      }));
      try {
        const data = await FETCH_FNS[tab](page, PAGE_SIZE, signal);
        const incoming = dedup(tab, data.content);
        setTabCache((prev) => {
          const existing = prev[tab] ?? [];
          const merged = dedup(tab, [...existing, ...incoming]);
          return { ...prev, [tab]: merged };
        });
        setTabMeta((prev) => ({
          ...prev,
          [tab]: {
            nextPage: page + 1,
            hasMore: !data.last,
            fetching: false,
          },
        }));
      } catch (err: unknown) {
        const e = err as { code?: string; name?: string };
        if (e?.code === 'ERR_CANCELED' || e?.name === 'CanceledError') return;
        setTabCache((prev) => ({ ...prev, [tab]: prev[tab] ?? [] }));
        setTabMeta((prev) => ({
          ...prev,
          [tab]: { nextPage: page, hasMore: false, fetching: false },
        }));
      }
    },
    [dedup], // eslint-disable-line react-hooks/exhaustive-deps
  );

  /* 탭 전환 시 첫 페이지 로드 */
  useEffect(() => {
    if (tabCache[activeTab] !== undefined) return;
    const controller = new AbortController();
    fetchPage(activeTab, 0, controller.signal);
    return () => controller.abort();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Store 업데이트 - 모든 탭의 데이터를 수집해서 좋아요 상태 동기화 */
  useEffect(() => {
    const allPosts = Object.values(tabCache).flat();
    const likedPostIds = allPosts
      .filter((post) => post.isHearted)
      .map((post) => post.postId);
    useLikeStore.getState().setLikedPosts(likedPostIds);
  }, [tabCache]);

  const posts: MainPost[] = tabCache[activeTab] ?? [];
  const loading = tabCache[activeTab] === undefined;
  const isFetchingMore = tabMeta[activeTab]?.fetching && posts.length > 0;

  return {
    activeTab,
    setActiveTab,
    posts,
    loading,
    isFetchingMore,
    tabMeta,
    tabCache,
    fetchPage,
  };
};
