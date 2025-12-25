/**
 * Kerben Design System - Spacing
 * Система отступов для консистентного UI
 */

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const

// Семантические отступы для быстрого использования
export const semanticSpacing = {
  // Внутренние отступы компонентов
  componentPadding: {
    xs: spacing[1], // 4px
    sm: spacing[2], // 8px
    md: spacing[3], // 12px
    lg: spacing[4], // 16px
    xl: spacing[6], // 24px
  },

  // Отступы между элементами
  gap: {
    xs: spacing[1], // 4px
    sm: spacing[2], // 8px
    md: spacing[3], // 12px
    lg: spacing[4], // 16px
    xl: spacing[6], // 24px
    '2xl': spacing[8], // 32px
  },

  // Отступы секций
  section: {
    sm: spacing[4], // 16px
    md: spacing[6], // 24px
    lg: spacing[8], // 32px
    xl: spacing[12], // 48px
  },

  // Отступы страниц
  page: {
    sm: spacing[4], // 16px
    md: spacing[6], // 24px
    lg: spacing[8], // 32px
  },

  // Отступы для инпутов
  input: {
    paddingX: spacing[3], // 12px
    paddingY: spacing[2], // 8px
  },

  // Отступы для кнопок
  button: {
    paddingX: {
      sm: spacing[3], // 12px
      md: spacing[4], // 16px
      lg: spacing[6], // 24px
    },
    paddingY: {
      sm: spacing[1.5], // 6px
      md: spacing[2], // 8px
      lg: spacing[3], // 12px
    },
  },

  // Отступы для карточек
  card: {
    padding: spacing[4], // 16px
    gap: spacing[3], // 12px
  },

  // Отступы для модальных окон
  modal: {
    padding: spacing[6], // 24px
    gap: spacing[4], // 16px
  },
} as const

export type Spacing = typeof spacing
export type SemanticSpacing = typeof semanticSpacing
