const baseWeights = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
} as const;

export const Typography = {
  family: {
    system: "'Pretendard'",
  },

  weight: baseWeights,

  heading: {
    XXL: { size: '2.25rem', weight: baseWeights }, // 36px
    XL: { size: '2rem', weight: baseWeights }, // 32px
    L: { size: '1.75rem', weight: baseWeights }, // 28px
    M: { size: '1.5rem', weight: baseWeights }, // 24px
    S: { size: '1.25rem', weight: baseWeights }, // 20px
  },

  body: {
    L: { size: '1.125rem', weight: baseWeights }, // 18px
    M: { size: '1rem', weight: baseWeights }, // 16px
    S: { size: '0.875rem', weight: baseWeights }, // 14px
  },

  caption: {
    L: { size: '0.8125rem', weight: baseWeights }, // 13px
    M: { size: '0.75rem', weight: baseWeights }, // 12px
    S: { size: '0.6875rem', weight: baseWeights }, // 11px
  },
} as const;

export type Typography = typeof Typography;
export default Typography;
