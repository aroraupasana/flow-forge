import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowDefinition,
  NodeType,
  RawWorkflowResponse,
  RawWorkflowNode,
  RawWorkflowEdge,
} from "@/types/workflow";

export const transformWorkflowResponse = (
  rawResponse: RawWorkflowResponse
): { workflowId: string; definition: WorkflowDefinition } => {
  const workflowId = rawResponse.workflowId;
  const rawDefinition = rawResponse.definition;

  const transformedNodes: WorkflowNode[] = rawDefinition.nodes
    ? Object.values(rawDefinition.nodes).map((rawNode: RawWorkflowNode) => ({
        nodeId: rawNode.nodeId,
        nodeType: rawNode.nodeType.toLowerCase() as NodeType,
        nodeName: rawNode.activityName || rawNode.nodeName,
        params: rawNode.nodeParams?.params || {},
      }))
    : [];

  const transformedEdges: WorkflowEdge[] = rawDefinition.edges
    ? rawDefinition.edges.map((rawEdge: RawWorkflowEdge) => ({
        edgeId: rawEdge.edgeName,
        sourceNodeId: rawEdge.fromNodeId,
        targetNodeId: rawEdge.toNodeId,
        edgeType: "default",
      }))
    : [];

  return {
    workflowId,
    definition: {
      workflowName: `Workflow ${workflowId}`,
      nodes: transformedNodes,
      edges: transformedEdges,
      workflowId,
      createdAt: rawDefinition.createdAt,
      updatedAt: rawDefinition.updatedAt,
    },
  };
};
