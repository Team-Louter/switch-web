import { create } from 'zustand';

interface LikeStore {
  likedPostIds: Set<number>;
  addLikedPost: (postId: number) => void;
  removeLikedPost: (postId: number) => void;
  toggleLikedPost: (postId: number) => void;
  isPostLiked: (postId: number) => boolean;
  setLikedPosts: (postIds: number[]) => void;
}

export const useLikeStore = create<LikeStore>((set, get) => ({
  likedPostIds: new Set(),

  addLikedPost: (postId: number) => {
    set((state) => {
      const updated = new Set(state.likedPostIds);
      updated.add(postId);
      return { likedPostIds: updated };
    });
  },

  removeLikedPost: (postId: number) => {
    set((state) => {
      const updated = new Set(state.likedPostIds);
      updated.delete(postId);
      return { likedPostIds: updated };
    });
  },

  toggleLikedPost: (postId: number) => {
    const { isPostLiked } = get();
    if (isPostLiked(postId)) {
      get().removeLikedPost(postId);
    } else {
      get().addLikedPost(postId);
    }
  },

  isPostLiked: (postId: number) => {
    return get().likedPostIds.has(postId);
  },

  setLikedPosts: (postIds: number[]) => {
    set({ likedPostIds: new Set(postIds) });
  },
}));
