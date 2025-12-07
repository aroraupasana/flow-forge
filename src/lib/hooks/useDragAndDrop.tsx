import { useCallback, useRef } from "react";
import type { WorkflowNode } from "@/types/workflow";

export const useDragAndDrop = (
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>
) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback(
    (
      event: React.DragEvent,
      nodeName: string,
      nodeType: "trigger" | "controller" | "activity"
    ) => {
      event.dataTransfer.setData(
        "application/reactflow",
        JSON.stringify({ nodeName, nodeType })
      );
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const { nodeName, nodeType } = JSON.parse(data);

      const newNodeId = `node_${Date.now()}`;
      const newNode: WorkflowNode = {
        nodeId: newNodeId,
        nodeType,
        nodeName,
        params: {},
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return {
    reactFlowWrapper,
    handleDragStart,
    handleDrop,
    handleDragOver,
  };
};
