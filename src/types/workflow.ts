export type NodeType = "trigger" | "controller" | "activity";

export interface NodeParam {
  type: string;
  hint?: string;
  isRequired?: boolean;
  allowedValues?: string[];
  options?: NodeParam[];
  elementType?: NodeParam;
  fieldName?: NodeParam;
  operator?: NodeParam;
  value?: NodeParam;
  oldValue?: NodeParam;
  newValue?: NodeParam;
  dataclassDict?: NodeParam;
}

export interface NodeDetails {
  name: string;
  type: NodeType;
  params: Record<string, NodeParam>;
  error?: string;
}

export interface NodeListResponse {
  activities?: {
    count: number;
    items: string[];
  };
  controllers?: {
    count: number;
    items: string[];
  };
  triggers?: {
    count: number;
    items: string[];
  };
  total_count?: number;
  type?: string;
  count?: number;
  items?: string[];
}

export interface WorkflowNode {
  nodeId: string;
  nodeType: NodeType;
  nodeName: string;
  params: Record<string, unknown>;
}

export interface WorkflowEdge {
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  edgeType?: string;
}

export interface WorkflowDefinition {
  workflowId?: string;
  workflowName: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RawWorkflowNode {
  nodeId: string;
  nodeName: string;
  nodeType: "Trigger" | "Controller" | "Activity";
  activityName: string;
  nodeParams: {
    params: Record<string, unknown>;
  };
  nodeInputs?: Record<string, unknown>;
  startToCloseTimeoutInMinutes?: number;
}

export interface RawWorkflowEdge {
  fromNodeId: string;
  toNodeId: string;
  edgeName: string;
}

export interface RawWorkflowDefinition {
  nodes: Record<string, RawWorkflowNode>;
  edges: RawWorkflowEdge[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RawWorkflowResponse {
  workflowId: string;
  definition: RawWorkflowDefinition;
}

export interface WorkflowResponse {
  workflowId: string;
  definition: WorkflowDefinition;
}

export interface UpdateWorkflowResponse {
  workflowId: string;
  message: string;
  updatedAt: string;
}
