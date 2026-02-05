import React from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

/**
 * Reusable button component with multiple variants
 */
const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  className = '',
  type = 'button',
  ...props
}) => {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled && 'btn--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  /** Button content */
  children: PropTypes.node.isRequired,
  /** Click handler */
  onClick: PropTypes.func,
  /** Disabled state */
  disabled: PropTypes.bool,
  /** Visual variant */
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  /** Button size */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Button type attribute */
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;
