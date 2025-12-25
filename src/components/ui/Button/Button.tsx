import React from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info'
  | 'ghost'
  | 'outline'
  | 'link'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Вариант стиля кнопки */
  variant?: ButtonVariant
  /** Размер кнопки */
  size?: ButtonSize
  /** Полная ширина */
  fullWidth?: boolean
  /** Состояние загрузки */
  loading?: boolean
  /** Иконка слева */
  leftIcon?: React.ReactNode
  /** Иконка справа */
  rightIcon?: React.ReactNode
  /** Только иконка (квадратная кнопка) */
  iconOnly?: boolean
  /** Дочерние элементы */
  children?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classNames = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      fullWidth && styles.fullWidth,
      loading && styles.loading,
      iconOnly && styles.iconOnly,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className={styles.spinner}>
            <svg
              className={styles.spinnerIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={styles.spinnerCircle}
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </span>
        )}
        {!loading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        {children && <span className={styles.text}>{children}</span>}
        {!loading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
