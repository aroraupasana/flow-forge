import { useState, useCallback } from "react";
import type { WorkflowNode, WorkflowEdge } from "@/types/workflow";

export const useNodeManagement = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>,
  setEdges: React.Dispatch<React.SetStateAction<WorkflowEdge[]>>
) => {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const workflowNode = nodes.find((n) => n.nodeId === nodeId);
      if (workflowNode) {
        setSelectedNode(workflowNode);
      }
    },
    [nodes]
  );

  const handleNodeDoubleClick = useCallback(
    (nodeId: string) => {
      const workflowNode = nodes.find((n) => n.nodeId === nodeId);
      if (workflowNode) {
        setSelectedNode(workflowNode);
        setIsConfigModalOpen(true);
      }
    },
    [nodes]
  );

  const handleNodeConfigSave = useCallback(
    (nodeId: string, params: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) => (node.nodeId === nodeId ? { ...node, params } : node))
      );
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.filter((node) => node.nodeId !== selectedNode.nodeId)
    );
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.sourceNodeId !== selectedNode.nodeId &&
          edge.targetNodeId !== selectedNode.nodeId
      )
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const handleEdgesUpdate = useCallback(
    (updatedEdges: WorkflowEdge[]) => {
      setEdges(updatedEdges);
    },
    [setEdges]
  );

  return {
    selectedNode,
    isConfigModalOpen,
    setSelectedNode,
    setIsConfigModalOpen,
    handleNodeClick,
    handleNodeDoubleClick,
    handleNodeConfigSave,
    handleDeleteNode,
    handleEdgesUpdate,
  };
};
