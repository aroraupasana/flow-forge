"use client";

import React, { useState, useEffect } from "react";
import type { NodeDetails, NodeParam, WorkflowNode } from "@/types/workflow";
import { getNodeDetails } from "@/services/api";

interface NodeConfigModalProps {
  node: WorkflowNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeId: string, params: Record<string, unknown>) => void;
}

export default function NodeConfigModal({
  node,
  isOpen,
  onClose,
  onSave,
}: NodeConfigModalProps) {
  const [nodeDetails, setNodeDetails] = useState<NodeDetails | null>(null);
  const [params, setParams] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (node && isOpen) {
      loadNodeDetails();
      setParams(node.params || {});
    }
  }, [node, isOpen]);

  const loadNodeDetails = async () => {
    if (!node) return;

    try {
      setLoading(true);
      setError(null);
      const details = await getNodeDetails(node.nodeName);
      setNodeDetails(details);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load node details";
      setError(errorMessage);
      console.error("Error loading node details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (key: string, value: unknown) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    if (!node) return;
    onSave(node.nodeId, params as Record<string, unknown>);
    onClose();
  };

  const renderParamInput = (key: string, param: NodeParam) => {
    const value = params[key];
    const stringValue =
      typeof value === "string"
        ? value
        : typeof value === "number"
        ? String(value)
        : "";

    switch (param.type) {
      case "text":
      case "url":
        return (
          <input
            type="text"
            value={stringValue}
            onChange={(e) => handleParamChange(key, e.target.value)}
            placeholder={param.hint || key}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "dropdown":
        return (
          <select
            value={stringValue}
            onChange={(e) => handleParamChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {param.allowedValues?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "list":
        const listValue = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {listValue.map((item: unknown, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={typeof item === "string" ? item : String(item ?? "")}
                  onChange={(e) => {
                    const newList = [...listValue];
                    newList[index] = e.target.value;
                    handleParamChange(key, newList);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => {
                    const newList = listValue.filter(
                      (_: unknown, i: number) => i !== index
                    );
                    handleParamChange(key, newList);
                  }}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => handleParamChange(key, [...listValue, ""])}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Item
            </button>
          </div>
        );

      default:
        return (
          <textarea
            value={
              typeof value === "string" ? value : JSON.stringify(value, null, 2)
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleParamChange(key, parsed);
              } catch {
                handleParamChange(key, e.target.value);
              }
            }}
            placeholder={param.hint || key}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        );
    }
  };

  if (!isOpen || !node) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {node.nodeName}
              </h2>
              <p className="text-sm text-gray-500 capitalize mt-1">
                {node.nodeType} Node
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading node details...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">Error: {error}</div>
              <button
                onClick={loadNodeDetails}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : nodeDetails ? (
            <div className="space-y-4">
              {Object.entries(nodeDetails.params || {}).map(([key, param]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key}
                    {param.isRequired && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {param.hint && (
                    <p className="text-xs text-gray-500 mb-2">{param.hint}</p>
                  )}
                  {renderParamInput(key, param)}
                </div>
              ))}
              {Object.keys(nodeDetails.params || {}).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No parameters available for this node
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No node details available
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
