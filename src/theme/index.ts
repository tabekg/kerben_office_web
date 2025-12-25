/**
 * Kerben Design System - Main Export
 * Центральный файл экспорта всех токенов дизайн-системы
 */

import { colors } from './colors'
import { spacing, semanticSpacing } from './spacing'
import { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textStyles } from './typography'
import { borderRadius, borderWidth } from './borders'
import { shadows } from './shadows'
import { transitions, presetTransitions } from './transitions'
import { zIndex } from './zIndex'
import { breakpoints, mediaQueries } from './breakpoints'

// Re-export all
export { colors } from './colors'
export type { Colors, ColorScale } from './colors'

export { spacing, semanticSpacing } from './spacing'
export type { Spacing, SemanticSpacing } from './spacing'

export { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textStyles } from './typography'
export type { FontFamily, FontSize, FontWeight, TextStyles } from './typography'

export { borderRadius, borderWidth } from './borders'
export type { BorderRadius, BorderWidth } from './borders'

export { shadows } from './shadows'
export type { Shadows } from './shadows'

export { transitions, presetTransitions } from './transitions'
export type { Transitions, PresetTransitions } from './transitions'

export { zIndex } from './zIndex'
export type { ZIndex } from './zIndex'

export { breakpoints, mediaQueries } from './breakpoints'
export type { Breakpoints, MediaQueries } from './breakpoints'

// Полный объект темы для удобства
export const theme = {
  colors,
  spacing,
  semanticSpacing,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyles,
  borderRadius,
  borderWidth,
  shadows,
  transitions,
  presetTransitions,
  zIndex,
  breakpoints,
  mediaQueries,
} as const

export type Theme = typeof theme
