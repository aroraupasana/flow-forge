"use client";

import React, { useCallback, useMemo, useRef } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Handle,
  Position,
  ReactFlowProvider,
  NodeMouseHandler,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import type { WorkflowNode, WorkflowEdge, NodeType } from "@/types/workflow";
import {
  getNodeIcon,
  getNodeColor,
  getNodeTextColor,
  getNodeBorderColor,
  getRingColor,
  getEdgeColor as getEdgeColorByType,
} from "@/lib/utils/nodeUtils";

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick?: (nodeId: string) => void;
  onNodeDoubleClick?: (nodeId: string) => void;
  onEdgesUpdate?: (edges: WorkflowEdge[]) => void;
}

interface CustomNodeData {
  nodeName: string;
  nodeType: NodeType;
  params: Record<string, unknown>;
  nodeId: string;
}

const CustomNode = ({
  data,
  selected,
}: {
  data: CustomNodeData;
  selected: boolean;
}) => {
  return (
    <div
      className={`px-2 py-1.5 shadow-sm rounded border min-w-[100px] transition-all ${
        selected ? `shadow-md ring-1 ${getRingColor(data.nodeType)}` : ""
      } ${getNodeColor(data.nodeType)} ${getNodeBorderColor(
        data.nodeType,
        selected
      )} ${getNodeTextColor(data.nodeType)}`}
    >
      <div className="flex items-center gap-1">
        <span className="text-sm leading-none">
          {getNodeIcon(data.nodeType)}
        </span>
        <div className="flex flex-col min-w-0">
          <div className="font-semibold text-[11px] leading-tight truncate">
            {data.nodeName}
          </div>
          <div
            className={`text-[9px] font-medium capitalize leading-tight mt-0.5 opacity-80 ${getNodeTextColor(
              data.nodeType
            )}`}
          >
            {data.nodeType}
          </div>
        </div>
      </div>
      {data.nodeType !== "trigger" && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-blue-300 !w-2 !h-2 !border-2 !border-white"
          style={{ top: -5 }}
        />
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-green-300 !w-2 !h-2 !border-2 !border-white"
        style={{ bottom: -5 }}
      />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

function WorkflowCanvasInner({
  nodes: workflowNodes,
  edges: workflowEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onNodeDoubleClick,
  onEdgesUpdate,
}: WorkflowCanvasProps) {
  const reactFlowNodes = useMemo<Node[]>(() => {
    const nodesArray = Array.isArray(workflowNodes) ? workflowNodes : [];

    return nodesArray.map((node, index) => {
      const position = {
        x: (index % 5) * 140 + 100,
        y: Math.floor(index / 5) * 100 + 100,
      };

      return {
        id: node.nodeId,
        type: "custom",
        position,
        data: {
          nodeName: node.nodeName,
          nodeType: node.nodeType,
          params: node.params,
          nodeId: node.nodeId,
        },
      };
    });
  }, [workflowNodes]);

  const reactFlowEdges = useMemo<Edge[]>(() => {
    const edgesArray = Array.isArray(workflowEdges) ? workflowEdges : [];

    return edgesArray.map((edge) => {
      const sourceNode = workflowNodes.find(
        (n) => n.nodeId === edge.sourceNodeId
      );
      const edgeColor = sourceNode
        ? getEdgeColorByType(sourceNode.nodeType)
        : "#a3a3a3";

      return {
        id: edge.edgeId,
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: edgeColor,
          strokeWidth: 2.5,
        },
      };
    });
  }, [workflowEdges, workflowNodes]);

  const [nodes, setNodes, onNodesChangeInternal] =
    useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChangeInternal] =
    useEdgesState(reactFlowEdges);

  const isUpdatingNodesRef = useRef(false);
  const prevWorkflowNodesRef = useRef(workflowNodes);

  React.useEffect(() => {
    if (
      isUpdatingNodesRef.current ||
      prevWorkflowNodesRef.current === workflowNodes
    ) {
      return;
    }

    prevWorkflowNodesRef.current = workflowNodes;
    isUpdatingNodesRef.current = true;
    setNodes(reactFlowNodes);

    setTimeout(() => {
      isUpdatingNodesRef.current = false;
    }, 0);
  }, [reactFlowNodes, setNodes, workflowNodes]);

  const isUpdatingEdgesRef = useRef(false);
  const prevWorkflowEdgesRef = useRef(workflowEdges);

  React.useEffect(() => {
    if (
      isUpdatingEdgesRef.current ||
      prevWorkflowEdgesRef.current === workflowEdges
    ) {
      return;
    }

    prevWorkflowEdgesRef.current = workflowEdges;
    isUpdatingEdgesRef.current = true;
    setEdges(reactFlowEdges);

    setTimeout(() => {
      isUpdatingEdgesRef.current = false;
    }, 0);
  }, [reactFlowEdges, setEdges, workflowEdges]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (isUpdatingNodesRef.current) return;

      onNodesChangeInternal(changes);
    },
    [onNodesChangeInternal]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (isUpdatingEdgesRef.current) return;

      onEdgesChangeInternal(changes);
    },
    [onEdgesChangeInternal]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (targetNode?.data?.nodeType === "trigger") {
        alert("Trigger nodes cannot have incoming edges!");
        return;
      }

      const newEdges = addEdge(connection, edges);
      setEdges(newEdges);

      if (onEdgesUpdate) {
        const workflowEdgesArray: WorkflowEdge[] = newEdges.map((edge) => ({
          edgeId: edge.id,
          sourceNodeId: edge.source,
          targetNodeId: edge.target,
          edgeType: edge.type || "default",
        }));
        onEdgesUpdate(workflowEdgesArray);
      }

      onConnect(connection);
    },
    [nodes, edges, setEdges, onConnect, onEdgesUpdate]
  );

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  const handleNodeDoubleClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      onNodeDoubleClick?.(node.id);
    },
    [onNodeDoubleClick]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
