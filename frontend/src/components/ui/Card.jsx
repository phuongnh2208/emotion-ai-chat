import React from "react";
import "./Card.css";

/**
 * Card Component - A reusable card container with various styles
 *
 * @param {string} variant - Card variant: default, elevated, outlined, pastel
 * @param {string} size - Card size: sm, md, lg, xl
 * @param {boolean} fullWidth - Whether card should take full width
 * @param {boolean} hoverable - Whether card should have hover effect
 * @param {string} className - Additional CSS class names
 * @param {React.ReactNode} children - Card content
 * @param {function} onClick - Click handler (makes card clickable)
 */
const Card = ({
  children,
  variant = "default",
  size = "md",
  fullWidth = false,
  hoverable = false,
  className = "",
  onClick,
  ...props
}) => {
  const baseClasses = "larry-card";
  const variantClass = `larry-card--${variant}`;
  const sizeClass = `larry-card--${size}`;
  const widthClass = fullWidth ? "larry-card--full" : "";
  const hoverClass = hoverable ? "larry-card--hoverable" : "";
  const clickableClass = onClick ? "larry-card--clickable" : "";

  const classNames = [
    baseClasses,
    variantClass,
    sizeClass,
    widthClass,
    hoverClass,
    clickableClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Component = onClick ? "button" : "div";

  return (
    <Component className={classNames} onClick={onClick} {...props}>
      {children}
    </Component>
  );
};

/**
 * CardHeader - Header section of a card
 */
export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`larry-card__header ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * CardBody - Main content section of a card
 */
export const CardBody = ({ children, className = "", ...props }) => {
  return (
    <div className={`larry-card__body ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * CardFooter - Footer section of a card
 */
export const CardFooter = ({ children, className = "", ...props }) => {
  return (
    <div className={`larry-card__footer ${className}`} {...props}>
      {children}
    </div>
  );
};

// Export sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
