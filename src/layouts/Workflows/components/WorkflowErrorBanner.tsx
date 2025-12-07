"use client";

import React from "react";

interface WorkflowErrorBannerProps {
  error: string;
  onRetry: () => void;
}

export default function WorkflowErrorBanner({
  error,
  onRetry,
}: WorkflowErrorBannerProps) {
  return (
    <div className="bg-red-50 border-t border-red-200 px-4 md:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div className="text-sm text-red-600 min-w-0 flex-1">
        <strong>Error:</strong> {error}
        <span className="ml-2 text-xs text-red-500 block sm:inline">
          (You can still build a workflow - it will be saved when you click
          &quot;Save Workflow&quot;)
        </span>
      </div>
      <button
        onClick={onRetry}
        className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-200 hover:border-blue-300 whitespace-nowrap flex-shrink-0 font-medium shadow-sm hover:shadow transition-all duration-200"
      >
        Retry
      </button>
    </div>
  );
}
