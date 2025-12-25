/**
 * Kerben Design System - Transitions
 * Анимации и переходы
 */

export const transitions = {
  duration: {
    fastest: '50ms',
    fast: '100ms',
    normal: '150ms',
    slow: '200ms',
    slower: '300ms',
    slowest: '500ms',
  },
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Custom bezier curves
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// Предустановленные переходы
export const presetTransitions = {
  default: `all ${transitions.duration.normal} ${transitions.timing.smooth}`,
  fast: `all ${transitions.duration.fast} ${transitions.timing.smooth}`,
  slow: `all ${transitions.duration.slow} ${transitions.timing.smooth}`,
  colors: `background-color ${transitions.duration.normal} ${transitions.timing.smooth}, border-color ${transitions.duration.normal} ${transitions.timing.smooth}, color ${transitions.duration.normal} ${transitions.timing.smooth}`,
  opacity: `opacity ${transitions.duration.normal} ${transitions.timing.smooth}`,
  transform: `transform ${transitions.duration.normal} ${transitions.timing.smooth}`,
  shadow: `box-shadow ${transitions.duration.normal} ${transitions.timing.smooth}`,
} as const

export type Transitions = typeof transitions
export type PresetTransitions = typeof presetTransitions
