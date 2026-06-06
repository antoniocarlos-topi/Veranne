// ============================================================
// VERANNE — StarBorder
// Brilho animado nas bordas de botões premium
// ============================================================

import React from 'react'
import './StarBorder.css'

export function StarBorder({
  as: Component = 'button',
  className = '',
  color = '#C9A96E',
  speed = '4s',
  thickness = 1,
  children,
  style,
  ...rest
}) {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{ padding: `${thickness}px 0`, ...style }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className="star-border-inner">
        {children}
      </div>
    </Component>
  )
}
