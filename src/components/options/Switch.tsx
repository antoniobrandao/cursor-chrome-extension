import React from 'react'
import clsx from 'clsx'

type Props = {
  active?: boolean
  onClick?: () => void
  variant?: 'info' | 'success' | 'warning' | 'danger'
  disabled?: boolean
}

function Switch(props: Props) {
  const { active, onClick, variant = 'info', disabled } = props

  const rootStyles = clsx(
    'h-6 w-11',
    'transition',
    'cursor-pointer',
    'items-center rounded-full',
    'relative inline-flex',
    active ? 'bg-gray-700' : 'bg-gray-800',
  )

  const circleStyles = clsx(
    'transition',
    'inline-block h-4 w-4 transform rounded-full',
    active ? `bg-green-500 translate-x-6` : `translate-x-1 bg-gray-600`,
  )

  return (
    <div
      onClick={onClick}
      className={rootStyles}
      style={disabled ? { pointerEvents: 'none', opacity: 0.2 } : {}}
    >
      <span className={circleStyles} />
    </div>
  )
}

export default Switch
