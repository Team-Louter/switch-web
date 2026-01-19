export const Colors = {
  main: {
    white: '#FFFFFF',
    black: '#000000',
    yellow: '#FFD600',
  },

  accent: {
    primary: '#FFD600',
    secondary1: '#FFDE33',
    secondary2: '#FFE666',
    secondary3: '#FFEF99',
    secondary4: '#FFF7CC',
  },

  text: {
    white: '#FFFFFF',
    lightGray: '#B8B8B8',
    coolGray: '#8A95A0',
    dark: '#333333',
    black: '#000000',
    goldDark: '#D3AB00',
    gold: '#FFBB00',
    goldLight: '#FFD600',
  },

  border: {
    light: '#EEEEEE',
    dark: '#333333',
    highlight: '#FFD600',
  },

  fill: {
    white: '#FFFFFF',
    f5: '#F5F5F5',
    f3: '#F3F4F6',
    a0: '#A0A0A0',
    darkOverlay: 'rgba(12, 16, 20, 0.7)', // #0C1014 (70%)
    slate: '#4E5968',
    charcoal: '#2A2B2B',
    almostBlack: '#191A1A',
    black: '#000000',
    yellow: '#FFD600',
  },

  background: {
    white: '#FFFFFF',
    f5: '#F5F5F5',
    almostBlack: '#191A1A',
    yellow: '#FFD600',
  },

  state: {
    error: '#E23737',
    info: '#4B88CE',
    success: '#5DBC86',
    warning: '#FFD600',
  },

  calendar: {
    red: '#FC675F',
    blue: '#2CA4FB',
    black: '#191A1A',
  },
} as const;

export type Colors = typeof Colors;
export default Colors;
