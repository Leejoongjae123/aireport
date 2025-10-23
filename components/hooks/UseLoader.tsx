import React from 'react';

interface UseLoaderProps {
  isLoading: boolean;
}

export const useLoader = ({ isLoading }: UseLoaderProps) => {
  if (!isLoading) {
    return null;
  }

  const Loader = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <svg
        className="animate-spin h-16 w-16"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="#0077FF"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="#0077FF"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );

  return Loader;
};
