import { useState, useCallback } from 'react';
import { getMyPost, getCommentedPost, getLikedPost } from '@/api/User';
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

  return {
    activeTab,
    setActiveTab,
    tabMeta,
    tabCache,
    fetchPage,
  };
};
