import React from 'react'
import styles from './Spinner.module.css'

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'
export type SpinnerVariant = 'primary' | 'secondary' | 'white'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Размер */
  size?: SpinnerSize
  /** Вариант цвета */
  variant?: SpinnerVariant
  /** Текст для screen reader */
  label?: string
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'primary',
      label = 'Загрузка...',
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      styles.spinner,
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        className={classNames}
        role="status"
        aria-label={label}
        {...props}
      >
        <svg
          className={styles.svg}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className={styles.circle}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        <span className={styles.srOnly}>{label}</span>
      </div>
    )
  }
)

Spinner.displayName = 'Spinner'

export default Spinner
