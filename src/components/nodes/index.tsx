"use client"; // Add this if you're using Next.js 13 Client Component

import React from 'react';
import { Node, NodeProps, NodeTypes, Handle, Position } from '@xyflow/react';
import GradientWrapper from '@/components/GradientWrapper';
import styles from './Component.module.css';

// Define the data type for the PositionLoggerNode
export type PositionLoggerNodeData = {
  title?: string;
  Cost?: number;
  TotalResult?: number;
  Prob?: number;
  emoji?: string;
  id?: string;
  isMaxAbsResult?: boolean;
};

export type PositionLoggerNode = Node<PositionLoggerNodeData>;

// PositionLoggerNode Component
const PositionLoggerNode = ({ data }: NodeProps<PositionLoggerNode>) => {
  return (
    <div>

      {/* Apply GradientWrapper only if isMaxAbsResult is true */}
      {data.isMaxAbsResult ? (
        <div className={styles.wrapper}>
          <div className="relative overflow-hidden p-1 rounded-lg shadow-2xl">
            <GradientWrapper>

              <div className="flex items-center space-y-2 relative z-10 p-4 rounded-lg bg-slate-200 shadow-md">

                <div className="flex flex-col">
                  <div className={`rounded-full w-12 h-12 flex justify-center items-center bg-gray-100 ${data.emoji === '🥇' ? 'text-4xl' : 'text-2xl'
                    }`}>
                    {data.emoji}
                  </div>
                  <div className="text-2xl flex">{data.id}</div>
                </div>

                <div className="ml-2">
                  <div className="text-lg font-bold">{data.title}</div>
                  <div className="text-gray-500">Cost: {data.Cost ?? 0}$</div>
                  <div className="text-gray-500"> Prob: {data.Prob ?? 0}%</div>
                  <div className="text-gray-500">Result: {data.TotalResult}</div>
                </div>
              </div>



            </GradientWrapper>
          </div>
        </div>
      ) : (

        <div className="relative overflow-hidden p-1 rounded-lg shadow-2xl">
          <div className="flex items-center space-y-2 relative z-10 p-4 rounded-lg bg-slate-200 shadow-md">
            <div className="flex flex-col">
              <div className="rounded-full text-3xl w-12 h-12 flex justify-center items-center bg-gray-100">
                {data.emoji}
              </div>
              <div className="text-2xl flex">{data.id}</div>
            </div>

            <div className="ml-2">
              <div className="text-lg font-bold">{data.title}</div>
              <div className="text-gray-500">Cost: {data.Cost ?? 0}$</div>
              <div className="text-gray-500">Prob: {data.Prob ?? 0}%</div>
              <div className="text-gray-500">Result: {data.TotalResult}</div>
            </div>
          </div>
        </div>

      )}
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />

    </div>
  );
};


// Export the node type and component
export const nodeTypes: NodeTypes = {
  'position-logger': PositionLoggerNode,
};

export { PositionLoggerNode };
