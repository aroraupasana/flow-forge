import axios from "axios";
import type {
  NodeListResponse,
  NodeDetails,
  WorkflowDefinition,
  UpdateWorkflowResponse,
  RawWorkflowResponse,
} from "@/types/workflow";
import { transformWorkflowForApi } from "@/lib/utils/workflowTransform";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL is not defined. Please set it in your environment variables."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL) {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL is not defined. Please set it in your environment variables."
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error("Network Error:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const getNodes = async (
  nodeType?: "activities" | "controllers" | "triggers"
): Promise<NodeListResponse> => {
  try {
    const params = nodeType ? { node_type: nodeType } : {};
    const response = await api.get("/nodes", { params });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.warn("API endpoint not found, using mock data");
        // Return mock data for development/testing
        return getMockNodes(nodeType);
      }
      throw new Error(
        error.response?.data?.detail ||
          error.message ||
          `Failed to fetch nodes: ${
            error.response?.statusText || "Unknown error"
          }`
      );
    }
    throw error;
  }
};

function getMockNodes(
  nodeType?: "activities" | "controllers" | "triggers"
): NodeListResponse {
  const mockData: NodeListResponse = {
    activities: {
      count: 5,
      items: [
        "send_email_activity",
        "fetch_data_activity",
        "process_payment_activity",
        "slack_notification_activity",
        "webhook_activity",
      ],
    },
    controllers: {
      count: 2,
      items: ["if_else_controller", "payment_controller"],
    },
    triggers: {
      count: 3,
      items: [
        "email_received_trigger",
        "payment_completed_trigger",
        "timer_trigger",
      ],
    },
    total_count: 10,
  };

  if (nodeType) {
    return {
      type: nodeType,
      count: mockData[nodeType]?.count || 0,
      items: mockData[nodeType]?.items || [],
    };
  }

  return mockData;
}

export const getNodeDetails = async (
  nodeName: string
): Promise<NodeDetails> => {
  try {
    const response = await api.get(`/nodeDetails/${nodeName}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.warn(`Node details not found for ${nodeName}, using mock data`);
        // Return mock node details
        return getMockNodeDetails(nodeName);
      }
      throw new Error(
        error.response?.data?.detail ||
          error.message ||
          `Failed to fetch node details: ${
            error.response?.statusText || "Unknown error"
          }`
      );
    }
    throw error;
  }
};

function getMockNodeDetails(nodeName: string): NodeDetails {
  const nodeType = nodeName.includes("trigger")
    ? "trigger"
    : nodeName.includes("controller")
    ? "controller"
    : "activity";

  return {
    name: nodeName,
    type: nodeType,
    params: {
      example_param: {
        type: "text",
        hint: "Example parameter",
        isRequired: false,
      },
    },
  };
}

// Workflow Routes
export const getWorkflow = async (
  workflowId: string
): Promise<RawWorkflowResponse> => {
  try {
    const response = await api.get(`/workflows/${workflowId}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.warn(
          `Workflow ${workflowId} not found, returning empty workflow structure`
        );
        throw new Error(
          `Workflow with ID "${workflowId}" not found. You can still build a new workflow.`
        );
      }
      throw new Error(
        error.response?.data?.detail ||
          error.message ||
          `Failed to fetch workflow: ${
            error.response?.statusText || "Unknown error"
          }`
      );
    }
    throw error;
  }
};

export const updateWorkflow = async (
  workflowId: string,
  definition: WorkflowDefinition
): Promise<UpdateWorkflowResponse> => {
  try {
    const rawDefinition = transformWorkflowForApi(definition);

    const payload = {
      workflowName: definition.workflowName,
      ...rawDefinition,
    };

    const response = await api.put(`/workflow/update/${workflowId}`, payload);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ||
          error.message ||
          `Failed to update workflow: ${
            error.response?.statusText || "Unknown error"
          }`
      );
    }
    throw error;
  }
};
