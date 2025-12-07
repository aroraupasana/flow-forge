"use client";

import React from "react";

interface WorkflowLoadingProps {
  workflowId: string;
}

export default function WorkflowLoading({ workflowId }: WorkflowLoadingProps) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="text-lg text-gray-600 mb-2">Loading workflow...</div>
        <div className="text-sm text-gray-500">Workflow ID: {workflowId}</div>
      </div>
    </div>
  );
}
