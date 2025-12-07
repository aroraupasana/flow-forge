"use client";

import React from "react";
import type {
  WorkflowDefinition,
  WorkflowNode,
  WorkflowEdge,
} from "@/types/workflow";

interface WorkflowHeaderProps {
  workflow: WorkflowDefinition | null;
  workflowId: string;
  currentWorkflowId: string | null;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  saving: boolean;
  onSidebarToggle: () => void;
  onSave: () => void;
  onConfigureNode: () => void;
  onDeleteNode: () => void;
}

export default function WorkflowHeader({
  workflow,
  workflowId,
  currentWorkflowId,
  nodes,
  edges,
  selectedNode,
  saving,
  onSidebarToggle,
  onSave,
  onConfigureNode,
  onDeleteNode,
}: WorkflowHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={onSidebarToggle}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <h1
            className="text-xl md:text-2xl font-bold text-gray-900 truncate group relative"
            title={workflow?.workflowName || "Workflow Builder"}
          >
            {workflow?.workflowName || "Workflow Builder"}
            <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 whitespace-nowrap z-[100] hidden md:block">
              <div className="relative">
                {workflow?.workflowName || "Workflow Builder"}
                <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </h1>
          <div className="flex flex-col md:flex-row md:items-center md:gap-3 mt-1">
            <div
              className="text-xs md:text-sm text-gray-500 truncate group relative"
              title={`Workflow ID: ${currentWorkflowId || workflowId}`}
            >
              <span className="font-medium">ID:</span>{" "}
              {currentWorkflowId || workflowId}
              <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 whitespace-nowrap z-[100] hidden md:block">
                <div className="relative">
                  Workflow ID: {currentWorkflowId || workflowId}
                  <div className="absolute bottom-full left-4 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
            </div>
            {workflow?.createdAt && (
              <div className="text-xs text-gray-400">
                <span className="font-medium">Created:</span>{" "}
                {new Date(workflow.createdAt).toLocaleDateString()}
              </div>
            )}
            {workflow?.updatedAt && (
              <div className="text-xs text-gray-400">
                <span className="font-medium">Updated:</span>{" "}
                {new Date(workflow.updatedAt).toLocaleDateString()}
              </div>
            )}
            {workflow && (
              <div className="text-xs text-gray-400">
                <span className="font-medium">Nodes:</span> {nodes.length} |{" "}
                <span className="font-medium">Edges:</span> {edges.length}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {selectedNode && (
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={onConfigureNode}
              className="px-3 md:px-4 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-200 hover:border-blue-300 text-xs md:text-sm whitespace-nowrap font-medium shadow-sm hover:shadow transition-all duration-200"
            >
              <span className="hidden md:inline">Configure Node</span>
              <span className="md:hidden">Config</span>
            </button>
            <button
              onClick={onDeleteNode}
              className="px-3 md:px-4 py-1.5 bg-red-100 text-red-700 border border-red-200 rounded-md hover:bg-red-200 hover:border-red-300 text-xs md:text-sm whitespace-nowrap font-medium shadow-sm hover:shadow transition-all duration-200"
            >
              <span className="hidden md:inline">Delete Node</span>
              <span className="md:hidden">Delete</span>
            </button>
          </div>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 md:px-5 py-1.5 bg-green-100 text-green-700 border border-green-200 rounded-md hover:bg-green-200 hover:border-green-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed text-xs md:text-sm whitespace-nowrap font-medium shadow-sm hover:shadow transition-all duration-200"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
