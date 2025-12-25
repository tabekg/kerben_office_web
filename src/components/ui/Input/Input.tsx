import React from 'react'
import styles from './Input.module.css'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Лейбл */
  label?: string
  /** Подсказка */
  hint?: string
  /** Сообщение об ошибке */
  error?: string
  /** Размер */
  size?: InputSize
  /** Иконка слева */
  leftIcon?: React.ReactNode
  /** Иконка справа */
  rightIcon?: React.ReactNode
  /** Полная ширина */
  fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      size = 'md',
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    const wrapperClassNames = [
      styles.wrapper,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const inputWrapperClassNames = [
      styles.inputWrapper,
      styles[`size-${size}`],
      error && styles.hasError,
      disabled && styles.disabled,
      leftIcon && styles.hasLeftIcon,
      rightIcon && styles.hasRightIcon,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={wrapperClassNames}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={inputWrapperClassNames}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>
        {error && (
          <span id={`${inputId}-error`} className={styles.error}>
            {error}
          </span>
        )}
        {hint && !error && (
          <span id={`${inputId}-hint`} className={styles.hint}>
            {hint}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
