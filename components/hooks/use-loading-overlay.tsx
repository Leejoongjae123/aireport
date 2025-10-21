import React from 'react';

interface UseLoadingOverlayProps {
  isLoading: boolean;
  currentSection?: string | null;
}

export const useLoadingOverlay = ({ isLoading, currentSection }: UseLoadingOverlayProps) => {
  if (!isLoading) {
    return null;
  }

  const LoadingOverlay = (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
      <svg
        className="animate-spin h-12 w-12"
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
      {currentSection && (
        <p className="mt-4 text-sm text-gray-700 font-semibold">
          {currentSection} 수정 중...
        </p>
      )}
    </div>
  );

  return LoadingOverlay;
};
