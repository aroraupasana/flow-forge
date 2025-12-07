"use client";

import React, { useState } from "react";
import WorkflowCanvas from "@/layouts/Workflows/components/WorkflowCanvas";
import NodeSidebar from "@/layouts/Workflows/components/NodeSidebar";
import NodeConfigModal from "@/layouts/Workflows/components/NodeConfigModal";
import WorkflowHeader from "@/layouts/Workflows/components/WorkflowHeader";
import WorkflowErrorBanner from "@/layouts/Workflows/components/WorkflowErrorBanner";
import WorkflowLoading from "@/layouts/Workflows/components/WorkflowLoading";
import { useWorkflow } from "@/lib/hooks/useWorkflow";
import { useNodeManagement } from "@/lib/hooks/useNodeManagement";
import { useDragAndDrop } from "@/lib/hooks/useDragAndDrop";

import { Edge, Connection } from "reactflow";

interface WorkflowBuilderProps {
  workflowId: string;
}

export default function WorkflowBuilder({ workflowId }: WorkflowBuilderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    workflow,
    currentWorkflowId,
    nodes,
    edges,
    loading,
    saving,
    error,
    setNodes,
    setEdges,
    loadWorkflow,
    saveWorkflow,
  } = useWorkflow(workflowId);

  const {
    selectedNode,
    isConfigModalOpen,
    setSelectedNode,
    setIsConfigModalOpen,
    handleNodeClick,
    handleNodeDoubleClick,
    handleNodeConfigSave,
    handleDeleteNode,
    handleEdgesUpdate,
  } = useNodeManagement(nodes, edges, setNodes, setEdges);

  const { reactFlowWrapper, handleDragStart, handleDrop, handleDragOver } =
    useDragAndDrop(setNodes);

  if (loading) {
    return <WorkflowLoading workflowId={workflowId} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <NodeSidebar
        onDragStart={handleDragStart}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <WorkflowHeader
          workflow={workflow}
          workflowId={workflowId}
          currentWorkflowId={currentWorkflowId}
          nodes={nodes}
          edges={edges}
          selectedNode={selectedNode}
          saving={saving}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onSave={saveWorkflow}
          onConfigureNode={() => setIsConfigModalOpen(true)}
          onDeleteNode={handleDeleteNode}
        />
        <div
          ref={reactFlowWrapper}
          className="flex-1"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={() => {}}
            onEdgesChange={(_updatedEdges: Edge[]) => {}}
            onConnect={(_connection: Connection) => {}}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            onEdgesUpdate={handleEdgesUpdate}
          />
        </div>
        {error && <WorkflowErrorBanner error={error} onRetry={loadWorkflow} />}
      </div>
      <NodeConfigModal
        node={selectedNode}
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setSelectedNode(null);
        }}
        onSave={handleNodeConfigSave}
      />
    </div>
  );
}
