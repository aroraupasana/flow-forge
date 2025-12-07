import { useState, useEffect, useCallback } from "react";
import { getWorkflow, updateWorkflow } from "@/services/api";
import { transformWorkflowResponse } from "../utils/workflowTransform";
import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowDefinition,
} from "@/types/workflow";

export const useWorkflow = (workflowId: string) => {
  const [workflow, setWorkflow] = useState<WorkflowDefinition | null>(null);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(
    null
  );
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadWorkflow = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rawResponse = await getWorkflow(workflowId);
      const transformed = transformWorkflowResponse(rawResponse);
      setCurrentWorkflowId(transformed.workflowId);
      setWorkflow(transformed.definition);
      setNodes(transformed.definition.nodes);
      setEdges(transformed.definition.edges);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load workflow";
      setError(errorMessage);
      console.error("Error loading workflow:", err);

      const emptyWorkflow: WorkflowDefinition = {
        workflowName: "New Workflow",
        nodes: [],
        edges: [],
      };
      setWorkflow(emptyWorkflow);
      setNodes([]);
      setEdges([]);
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  const saveWorkflow = useCallback(async () => {
    if (!workflow) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const updatedDefinition: WorkflowDefinition = {
        ...workflow,
        nodes,
        edges,
      };
      await updateWorkflow(workflowId, updatedDefinition);
      setSuccessMessage("Workflow saved successfully!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save workflow";
      setError(errorMessage);
      console.error("Error saving workflow:", err);
    } finally {
      setSaving(false);
    }
  }, [workflow, nodes, edges, workflowId]);

  useEffect(() => {
    loadWorkflow();
  }, [loadWorkflow]);

  return {
    workflow,
    currentWorkflowId,
    nodes,
    edges,
    loading,
    saving,
    error,
    successMessage,
    setNodes,
    setEdges,
    loadWorkflow,
    saveWorkflow,
    setSuccessMessage,
  };
};
