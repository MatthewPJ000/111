import ButtonEdge, { type ButtonEdge as ButtonEdgeType } from './ButtonEdge';
import type { EdgeTypes, BuiltInEdge } from '@xyflow/react';

export const edgeTypes: EdgeTypes = {
  'button-edge': ButtonEdge,
};

export type CustomEdgeType = BuiltInEdge | ButtonEdgeType;
