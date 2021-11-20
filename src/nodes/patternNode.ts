import { Node } from 'acorn';
import { ExpressionNode } from './expressionNodes';
import { IdentifierNode, PropertyNode } from './sharedNodes';

export type PatternNode =
  | ObjectPatternNode
  | ArrayPatternNode
  | RestElementNode
  | AssignmentPatternNode
  | IdentifierNode;

enum PatternTypes {
  ObjectPatternType = 'ObjectPattern',
  ArrayPatternType = 'ArrayPattern',
  RestElementType = 'RestElement',
  AssignmentPatternType = 'AssignmentPattern'
}

interface AssignmentPropertyNode extends Omit<PropertyNode, 'value'> {
  value: PatternNode;
  kind: 'init';
  method: false;
}

export interface ObjectPatternNode extends Node {
  type: PatternTypes.ObjectPatternType;
  properties: [AssignmentPropertyNode | RestElementNode];
}

export function isObjectPatternNode(node: Node): node is ObjectPatternNode {
  return node.type === PatternTypes.ObjectPatternType;
}

export interface ArrayPatternNode extends Node {
  type: PatternTypes.ArrayPatternType;
  elements: PatternNode[] | null;
}

export function isArrayPatternNode(node: Node): node is ArrayPatternNode {
  return node.type === PatternTypes.ArrayPatternType;
}

export interface RestElementNode extends Node {
  type: PatternTypes.RestElementType;
  argument: PatternNode;
}

export function isRestElementNode(node: Node): node is RestElementNode {
  return node.type === PatternTypes.RestElementType;
}

export interface AssignmentPatternNode extends Node {
  type: PatternTypes.AssignmentPatternType;
  left: PatternNode;
  right: ExpressionNode;
}

export function isAssignmentPatternNode(node: Node): node is AssignmentPatternNode {
  return node.type === PatternTypes.AssignmentPatternType;
}
