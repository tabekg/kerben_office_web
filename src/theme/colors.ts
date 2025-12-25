/**
 * Kerben Design System - Colors
 * Цветовая палитра для всего приложения
 */

export const colors = {
  // Primary - основной цвет бренда
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // main
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Secondary - дополнительный цвет
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b', // main
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Success - успешные действия
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // main
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning - предупреждения
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // main
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error/Danger - ошибки
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // main
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Info - информационные сообщения
  info: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4', // main
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Neutral - нейтральные цвета для текста и фонов
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Status colors - для отображения статусов
  status: {
    online: '#16a34a',
    offline: '#dc2626',
    pending: '#f59e0b',
    onWay: '#3b82f6',
    completed: '#22c55e',
    archived: '#64748b',
    overload: '#f97316',
  },

  // Shipment type colors
  shipment: {
    transit: '#8b5cf6',
    autoCarrier: '#06b6d4',
    default: '#3b82f6',
  },

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    dark: '#0f172a',
    overlay: 'rgba(0, 0, 0, 0.5)',
    card: '#ffffff',
    input: '#ffffff',
  },

  // Text colors
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    muted: '#94a3b8',
    inverse: '#ffffff',
    link: '#2563eb',
    linkHover: '#1d4ed8',
  },

  // Border colors
  border: {
    light: '#e2e8f0',
    default: '#cbd5e1',
    dark: '#94a3b8',
    focus: '#3b82f6',
  },
} as const

// Type exports
export type ColorScale = typeof colors.primary
export type Colors = typeof colors
