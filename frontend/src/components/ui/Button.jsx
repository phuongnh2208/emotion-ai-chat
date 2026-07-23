import React from "react";
import "./Button.css";

/**
 * Button Component - A reusable button with various styles and sizes
 *
 * @param {string} variant - Button variant: primary, secondary, outline, ghost, danger
 * @param {string} size - Button size: sm, md, lg, xl
 * @param {boolean} fullWidth - Whether button should take full width
 * @param {boolean} disabled - Whether button is disabled
 * @param {boolean} loading - Whether button is in loading state
 * @param {string} leftIcon - Icon to display on the left
 * @param {string} rightIcon - Icon to display on the right
 * @param {string} type - Button type: button, submit, reset
 * @param {string} className - Additional CSS class names
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} children - Button content
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  type = "button",
  className = "",
  onClick,
  ...props
}) => {
  const baseClasses = "larry-btn";
  const variantClass = `larry-btn--${variant}`;
  const sizeClass = `larry-btn--${size}`;
  const widthClass = fullWidth ? "larry-btn--full" : "";
  const disabledClass = disabled || loading ? "larry-btn--disabled" : "";
  const loadingClass = loading ? "larry-btn--loading" : "";

  const classNames = [
    baseClasses,
    variantClass,
    sizeClass,
    widthClass,
    disabledClass,
    loadingClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="larry-btn__spinner" aria-hidden="true">
          <span className="spinner-dot"></span>
          <span className="spinner-dot"></span>
          <span className="spinner-dot"></span>
        </span>
      )}
      <span className="larry-btn__content">
        {leftIcon && (
          <span
            className="larry-btn__icon larry-btn__icon--left"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}
        <span className="larry-btn__text">{children}</span>
        {rightIcon && (
          <span
            className="larry-btn__icon larry-btn__icon--right"
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </span>
    </button>
  );
};

export default Button;
