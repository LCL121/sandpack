import { Node } from 'acorn';

export interface ProgramNode extends Node {
  type: 'Program';
  body: Node[];
}

export function isProgramNode(node: Node): node is ProgramNode {
  return node.type === 'Program';
}
