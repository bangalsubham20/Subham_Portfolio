import React, { ReactNode, MouseEvent } from 'react';
import { useTransition } from '../context/TransitionContext';

interface TransitionLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  style?: React.CSSProperties;
}

const TransitionLink: React.FC<TransitionLinkProps> = ({ to, children, className, onClick, style }) => {
  const { playTransition } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // If an onClick prop is passed, call it first
    if (onClick) {
      onClick(e);
    }

    // Then, play the transition
    playTransition(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
};

export default TransitionLink;