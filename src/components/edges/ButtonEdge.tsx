// components/ButtonEdge.tsx
import React from "react";
import { getBezierPath, type EdgeProps, type Edge } from '@xyflow/react';

type ButtonEdgeData = Record<string, never>;
export type ButtonEdge = Edge<ButtonEdgeData>;

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps<ButtonEdge>) {
  const xEqual = sourceX === targetX;
  const yEqual = sourceY === targetY;
  const [edgePath] = getBezierPath({
    sourceX: xEqual ? sourceX + 0.0001 : sourceX,
    sourceY: yEqual ? sourceY + 0.0001 : sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        d={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: "url(#edge-gradient)" }}
        className="react-flow__edge-path stroke-2 opacity-75"
      />  
    </>
  );
}
