"use client";

import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type OnConnect,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import getLayoutedElements from "../utils/layout"; // Ensure this utility is correct
import { edgeTypes } from "./edges";
import { nodeTypes } from "./nodes";
import DownloadButton from "./DownloadButton";
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
type MyNode = Node & {
  data: {
    isMaxAbsResult: boolean;
    title: string;
    Cost: number;
    Prob: number;
    TotalResult: number;
    emoji: string;
  };
  position: { x: number; y: number };
};

type MyEdge = Edge & {};

interface FlowProps {
  selectedCategory: string;
}

interface Component {
  _id: string;
  componentName: string;
  title?: string;
  Cost: number;
  Prob: number;
  TotalResult: number;
  inputs: Input[];
  emoji?: string;
  parentComponentName?: string;
  isMaxAbsResult?: boolean;
}

interface Input {
  id: number;
  content: string;
  value: number;
  isAdding: boolean;
}

const Flow: React.FC<FlowProps> = ({ selectedCategory }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<MyNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<MyEdge>([]);
  const [layoutApplied, setLayoutApplied] = useState(false);

  useEffect(() => {
    const fetchAllComponents = async () => {
      if (!selectedCategory) return;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/data/${selectedCategory}/allcomponents`
        );
        const components = response.data.components || [];

        const fetchedNodes: MyNode[] = components.map(
          (component: Component) => {
            const costInput = component.inputs.find(
              (input) => input.content === "Cost($)"
            );
            const probInput = component.inputs.find(
              (input) => input.content === "Prob(%)"
            );

            return {
              id: component.componentName,
              type: "position-logger", // Adjust based on your needs
              data: {
                id: component.componentName,
                isMaxAbsResult: component.isMaxAbsResult || false,
                title: component.title || "initial",
                Cost: costInput ? costInput.value : 0,
                Prob: probInput ? probInput.value : 0,
                TotalResult: component.TotalResult || 0,
                emoji: component.isMaxAbsResult ? "🥇" : component.emoji || "✏", // Change emoji based on isMaxAbsResult
              },
              position: { x: 0, y: 0 },
            };
          }
        );

        // Step 1: Collect Parentname from components where component.isMaxAbsResult === true
        const Parentname: string[] = [];

        components.forEach((component: Component) => {
          if (component.isMaxAbsResult === true) {
            const targetId = component.componentName;
            const parts = targetId.split(">"); // Split into ["1", "1", "1", "3"]

            // Create all intermediate levels
            for (let i = parts.length; i > 0; i--) {
              const level = parts.slice(0, i).join(">");
              if (!Parentname.includes(level)) {
                Parentname.push(level);
              }
            }
          }
        });

        const fetchedEdges: MyEdge[] = components.map(
          (component: Component) => {
            const sourceId = component.parentComponentName || "root"; // Default source if parentComponentName doesn't exist
            const targetId = component.componentName;

            // Check if the targetId is part of Parentname and set animated to true
            const animated = Parentname.includes(targetId);

            return {
              id: `${sourceId}-${targetId}`,
              source: sourceId,
              target: targetId,
              type: "smoothstep",
              animated: animated, // This will be true if targetId is in Parentname[]
            };
          }
        );

        setNodes(fetchedNodes);
        setEdges(fetchedEdges);

        setLayoutApplied(false);
      } catch (error) {
        console.error("Error fetching components data:", error);
      }
    };

    fetchAllComponents();
  }, [selectedCategory]);

  useEffect(() => {
    if (layoutApplied || nodes.length === 0 || edges.length === 0) return;

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    
    setNodes(layoutedNodes as MyNode[]); // Type assertion to ensure it's MyNode[]
    
    setEdges(layoutedEdges as MyEdge[]);
    setLayoutApplied(true);
  }, [nodes, edges, layoutApplied]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes.map((node) => ({ ...node, key: node.id }))}
      edges={edges.map((edge) => ({ ...edge, key: edge.id }))}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Background />
      <MiniMap />
      <div className="group absolute bottom-10 left-3">
        <Controls />
      </div>
      <DownloadButton />
    </ReactFlow>
  );
};

export default Flow;
