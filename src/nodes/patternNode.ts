import { Node } from 'acorn';
import { ExpressionNode } from './expressionNodes';
import { IdentifierNode, PropertyNode } from './sharedNodes';

export type PatternNode =
  | ObjectPatternNode
  | ArrayPatternNode
  | RestElementNode
  | AssignmentPatternNode
  | IdentifierNode;

interface AssignmentPropertyNode extends Omit<PropertyNode, 'value'> {
  value: PatternNode;
  kind: 'init';
  method: false;
}

export interface ObjectPatternNode extends Node {
  type: 'ObjectPattern';
  properties: [AssignmentPropertyNode | RestElementNode];
}

export function isObjectPatternNode(node: Node): node is ObjectPatternNode {
  return node.type === 'ObjectPattern';
}

export interface ArrayPatternNode extends Node {
  type: 'ArrayPattern';
  elements: PatternNode[] | null;
}

export function isArrayPatternNode(node: Node): node is ArrayPatternNode {
  return node.type === 'ArrayPattern';
}

export interface RestElementNode extends Node {
  type: 'RestElement';
  argument: PatternNode;
}

export function isRestElementNode(node: Node): node is RestElementNode {
  return node.type === 'RestElement';
}

export interface AssignmentPatternNode extends Node {
  type: 'AssignmentPattern';
  left: PatternNode;
  right: ExpressionNode;
}

export function isAssignmentPatternNode(node: Node): node is AssignmentPatternNode {
  return node.type === 'AssignmentPattern';
}
