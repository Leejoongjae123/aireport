import React from 'react';

interface UseButtonLoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export const useButtonLoader = ({
  size = 24,
  color = '#0077FF',
  className = '',
}: UseButtonLoaderProps = {}) => {
  const Loader = (
    <svg
      className={`shrink-0 animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="#D9D9D9" strokeWidth="2" />
      <path
        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12H23C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1V3Z"
        fill={color}
      />
    </svg>
  );

  return Loader;
};
