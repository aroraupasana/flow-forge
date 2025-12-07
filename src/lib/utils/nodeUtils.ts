import type { NodeType } from "@/types/workflow";

export const getNodeIcon = (nodeType: NodeType): string => {
  switch (nodeType) {
    case "trigger":
      return "⚡";
    case "controller":
      return "🔀";
    case "activity":
      return "⚙️";
    default:
      return "📦";
  }
};

export const getNodeColor = (nodeType: NodeType): string => {
  switch (nodeType) {
    case "trigger":
      return "bg-blue-100";
    case "controller":
      return "bg-purple-100";
    case "activity":
      return "bg-green-100";
    default:
      return "bg-gray-100";
  }
};

export const getNodeTextColor = (nodeType: NodeType): string => {
  switch (nodeType) {
    case "trigger":
      return "text-blue-800";
    case "controller":
      return "text-purple-800";
    case "activity":
      return "text-green-800";
    default:
      return "text-gray-800";
  }
};

export const getNodeBorderColor = (
  nodeType: NodeType,
  selected: boolean
): string => {
  if (selected) {
    switch (nodeType) {
      case "trigger":
        return "border-blue-300";
      case "controller":
        return "border-purple-300";
      case "activity":
        return "border-green-300";
      default:
        return "border-gray-300";
    }
  }
  switch (nodeType) {
    case "trigger":
      return "border-blue-200";
    case "controller":
      return "border-purple-200";
    case "activity":
      return "border-green-200";
    default:
      return "border-gray-200";
  }
};

export const getRingColor = (nodeType: NodeType): string => {
  switch (nodeType) {
    case "trigger":
      return "ring-blue-300";
    case "controller":
      return "ring-purple-300";
    case "activity":
      return "ring-green-300";
    default:
      return "ring-gray-300";
  }
};

export const getNodeItemBg = (
  type: "trigger" | "controller" | "activity"
): string => {
  switch (type) {
    case "trigger":
      return "bg-blue-50 border-blue-100 hover:bg-blue-100";
    case "controller":
      return "bg-purple-50 border-purple-100 hover:bg-purple-100";
    case "activity":
      return "bg-green-50 border-green-100 hover:bg-green-100";
    default:
      return "bg-gray-50 border-gray-100 hover:bg-gray-100";
  }
};

export const getNodeItemText = (
  type: "trigger" | "controller" | "activity"
): string => {
  switch (type) {
    case "trigger":
      return "text-blue-800 font-semibold";
    case "controller":
      return "text-purple-800 font-semibold";
    case "activity":
      return "text-green-800 font-semibold";
    default:
      return "text-gray-800 font-semibold";
  }
};

export const getEdgeColor = (nodeType: NodeType): string => {
  switch (nodeType) {
    case "trigger":
      return "#60a5fa";
    case "controller":
      return "#a78bfa";
    case "activity":
      return "#4ade80";
    default:
      return "#a3a3a3";
  }
};
