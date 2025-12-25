/**
 * Kerben Design System - Breakpoints
 * Точки перелома для адаптивного дизайна
 */

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Media queries для использования в CSS-in-JS
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  // Max-width queries
  xsMax: `@media (max-width: ${breakpoints.xs})`,
  smMax: `@media (max-width: ${breakpoints.sm})`,
  mdMax: `@media (max-width: ${breakpoints.md})`,
  lgMax: `@media (max-width: ${breakpoints.lg})`,
  xlMax: `@media (max-width: ${breakpoints.xl})`,
} as const

export type Breakpoints = typeof breakpoints
export type MediaQueries = typeof mediaQueries
