"use client";

import React, { useState, useEffect } from "react";
import type { NodeListResponse } from "@/types/workflow";
import { getNodes } from "@/services/api";
import {
  getNodeIcon,
  getNodeItemBg,
  getNodeItemText,
} from "@/lib/utils/nodeUtils";

interface NodeSidebarProps {
  onDragStart: (
    event: React.DragEvent,
    nodeName: string,
    nodeType: "trigger" | "controller" | "activity"
  ) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function NodeSidebar({
  onDragStart,
  isOpen,
  onClose,
}: NodeSidebarProps) {
  const [nodeList, setNodeList] = useState<NodeListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "triggers" | "controllers" | "activities"
  >("all");

  useEffect(() => {
    loadNodes();
  }, []);

  const loadNodes = async () => {
    try {
      setLoading(true);
      const data = await getNodes();
      setNodeList(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load nodes";
      setError(errorMessage);
      console.error("Error loading nodes:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderNodeList = (
    items: string[],
    type: "trigger" | "controller" | "activity"
  ) => {
    return items.map((nodeName) => (
      <div
        key={nodeName}
        draggable
        onDragStart={(e) => onDragStart(e, nodeName, type)}
        className={`flex items-center gap-2 p-2.5 mb-1.5 rounded-md border shadow-sm cursor-move hover:shadow transition-all duration-200 group relative ${getNodeItemBg(
          type
        )}`}
        title={nodeName}
      >
        <span className="text-base flex-shrink-0 leading-none">
          {getNodeIcon(type)}
        </span>
        <div className="flex-1 min-w-0 relative" title={nodeName}>
          <div
            className={`text-xs truncate break-words ${getNodeItemText(type)}`}
          >
            {nodeName}
          </div>
          <div
            className={`text-[10px] capitalize leading-tight mt-0.5 font-medium ${getNodeItemText(
              type
            )} opacity-75`}
          >
            {type}
          </div>
          <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 whitespace-normal max-w-xs z-[100] hidden lg:block">
            <div className="relative">
              {nodeName}
              <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const getDisplayNodes = () => {
    if (!nodeList) return { items: [], type: "activity" as const };

    if (activeTab === "all") {
      return {
        triggers: nodeList.triggers?.items || [],
        controllers: nodeList.controllers?.items || [],
        activities: nodeList.activities?.items || [],
      };
    }

    if (activeTab === "triggers") {
      return {
        items: nodeList.triggers?.items || [],
        type: "trigger" as const,
      };
    }
    if (activeTab === "controllers") {
      return {
        items: nodeList.controllers?.items || [],
        type: "controller" as const,
      };
    }
    if (activeTab === "activities") {
      return {
        items: nodeList.activities?.items || [],
        type: "activity" as const,
      };
    }

    return { items: [], type: "activity" as const };
  };

  if (loading) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
        <div
          className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-4 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="text-sm text-gray-500 truncate">Loading nodes...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
        <div
          className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-4 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="text-sm text-red-500 break-words">Error: {error}</div>
          <button
            onClick={loadNodes}
            className="mt-2 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-200 hover:border-blue-300 whitespace-nowrap font-medium shadow-sm hover:shadow transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  const displayNodes = getDisplayNodes();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              Nodes
            </h2>
            <button
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-gray-700 text-2xl font-bold flex-shrink-0 ml-2"
            >
              ×
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "triggers", "controllers", "activities"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 text-xs rounded-md capitalize whitespace-nowrap font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "all" ? (
            <>
              {displayNodes.triggers && displayNodes.triggers.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1 truncate">
                    <span className="flex-shrink-0">⚡</span>{" "}
                    <span className="truncate">
                      Triggers ({displayNodes.triggers.length})
                    </span>
                  </h3>
                  {renderNodeList(displayNodes.triggers, "trigger")}
                </div>
              )}
              {displayNodes.controllers &&
                displayNodes.controllers.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1 truncate">
                      <span className="flex-shrink-0">🔀</span>{" "}
                      <span className="truncate">
                        Controllers ({displayNodes.controllers.length})
                      </span>
                    </h3>
                    {renderNodeList(displayNodes.controllers, "controller")}
                  </div>
                )}
              {displayNodes.activities &&
                displayNodes.activities.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1 truncate">
                      <span className="flex-shrink-0">⚙️</span>{" "}
                      <span className="truncate">
                        Activities ({displayNodes.activities.length})
                      </span>
                    </h3>
                    {renderNodeList(displayNodes.activities, "activity")}
                  </div>
                )}
            </>
          ) : displayNodes.items ? (
            renderNodeList(displayNodes.items, displayNodes.type)
          ) : null}
          {activeTab !== "all" &&
            displayNodes.items &&
            displayNodes.items.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-8">
                No nodes available
              </div>
            )}
          {activeTab === "all" &&
            (!displayNodes.triggers || displayNodes.triggers.length === 0) &&
            (!displayNodes.controllers ||
              displayNodes.controllers.length === 0) &&
            (!displayNodes.activities ||
              displayNodes.activities.length === 0) && (
              <div className="text-sm text-gray-500 text-center py-8">
                No nodes available
              </div>
            )}
        </div>
      </div>
    </>
  );
}
