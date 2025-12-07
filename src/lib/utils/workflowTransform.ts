import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowDefinition,
  NodeType,
  RawWorkflowResponse,
  RawWorkflowNode,
  RawWorkflowEdge,
  RawWorkflowDefinition,
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

export const transformWorkflowForApi = (
  definition: WorkflowDefinition
): Omit<RawWorkflowDefinition, "createdAt" | "updatedAt"> => {
  // Convert nodes array to object/dictionary keyed by nodeId
  const rawNodes: Record<string, RawWorkflowNode> = {};
  for (const node of definition.nodes) {
    // Capitalize first letter of nodeType for API
    const capitalizedNodeType =
      node.nodeType.charAt(0).toUpperCase() + node.nodeType.slice(1);

    rawNodes[node.nodeId] = {
      nodeId: node.nodeId,
      nodeName: node.nodeName,
      nodeType: capitalizedNodeType as "Trigger" | "Controller" | "Activity",
      activityName: node.nodeName,
      nodeParams: {
        params: node.params,
      },
    };
  }

  // Convert edges array to RawWorkflowEdge format
  const rawEdges: RawWorkflowEdge[] = definition.edges.map((edge) => ({
    fromNodeId: edge.sourceNodeId,
    toNodeId: edge.targetNodeId,
    edgeName: edge.edgeId,
  }));

  return {
    nodes: rawNodes,
    edges: rawEdges,
  };
};
