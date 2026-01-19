import { Colors } from './Colors';
import { Typography } from './Fonts'

export const theme = {
  colors: Colors,
  typography: Typography,
} as const;

export type Theme = typeof theme;
