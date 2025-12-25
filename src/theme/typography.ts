/**
 * Kerben Design System - Typography
 * Типографика для консистентного текста
 */

export const fontFamily = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace",
} as const

export const fontSize = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem', // 48px
} as const

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const

export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

// Предустановленные текстовые стили
export const textStyles = {
  // Заголовки
  h1: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  h4: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  h5: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
  },
  h6: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
  },

  // Тело текста
  bodyLg: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.relaxed,
  },
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  bodySm: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  bodyXs: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },

  // Специальные стили
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  },
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  overline: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.none,
  },
} as const

export type FontFamily = typeof fontFamily
export type FontSize = typeof fontSize
export type FontWeight = typeof fontWeight
export type TextStyles = typeof textStyles
