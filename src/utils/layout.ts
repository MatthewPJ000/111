import dagre from "dagre";
import { Node, Edge } from "@xyflow/react";


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


const nodeWidth = 210;
const nodeHeight = 170;

// Default edge style
const defaultEdgeStyle = {
  stroke: "#555", // Edge color
  strokeWidth: 2, // Edge thickness
  arrowHeadType: "arrow", // Arrowhead style
  animated: false, // Animation effect (if supported)
};

const getLayoutedElements = (nodes: MyNode[], edges: Edge[], direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Layout nodes with correct type
  const layoutedNodes = nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
      positionAbsolute: { dragging: false },
      data: node.data as MyNode['data'], // Ensure data matches the MyNode type
    };
  });

  const styledEdges = edges.map((edge) => ({
    ...edge,
    style: defaultEdgeStyle, // Apply the default edge style
  }));

  return { nodes: layoutedNodes, edges: styledEdges };
};


export default getLayoutedElements;
