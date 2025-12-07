"use client";

import React, { useEffect } from "react";

interface WorkflowSuccessBannerProps {
  message: string;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export default function WorkflowSuccessBanner({
  message,
  onDismiss,
  autoDismissMs = 3000,
}: WorkflowSuccessBannerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [onDismiss, autoDismissMs]);

  return (
    <div className="bg-green-50 border-t border-green-200 px-4 md:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div className="text-sm text-green-700 min-w-0 flex-1 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-green-600 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>
          <strong>Success:</strong> {message}
        </span>
      </div>
      <button
        onClick={onDismiss}
        className="px-3 py-1.5 text-xs bg-green-100 text-green-700 border border-green-200 rounded-md hover:bg-green-200 hover:border-green-300 whitespace-nowrap flex-shrink-0 font-medium shadow-sm hover:shadow transition-all duration-200"
      >
        Dismiss
      </button>
    </div>
  );
}
