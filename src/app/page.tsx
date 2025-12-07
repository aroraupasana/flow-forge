"use client";

import WorkflowBuilder from "@/layouts/Workflows";

const WORKFLOW_ID = "twflow_ce8f33f22c";

export default function Home() {
  return <WorkflowBuilder workflowId={WORKFLOW_ID} />;
}
