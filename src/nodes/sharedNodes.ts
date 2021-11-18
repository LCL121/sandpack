import { Node } from 'acorn';
import { ExpressionNode } from './expressionNodes';
import { FunctionBodyNode } from './statementNodes';


export interface SourceNode extends LiteralNode {
  value: string;
  raw: string;
}

export interface IdentifierNode extends Node {
  type: 'Identifier';
  name: string;
}

export interface VariableDeclarationNode extends Node {
  type: 'VariableDeclaration';
  kind: 'var' | 'let' | 'const';
  declarations: VariableDeclaratorNode[];
}

export interface VariableDeclaratorNode extends Node {
  type: 'VariableDeclarator';
  id: IdentifierNode;
  init: ExpressionNode;
}

export function isVariableDeclaratorNode(node: Node): node is VariableDeclaratorNode {
  return node.type === 'VariableDeclarator';
}

export interface LiteralNode extends ExpressionNode {
  type: "Literal";
  value: string | boolean | null | number | RegExp;
}

export interface FunctionDeclarationNode extends Node {
  type: 'FunctionDeclaration';
  id: IdentifierNode;
  params: IdentifierNode[];
  body: FunctionBodyNode;
}

export function isFunctionDeclarationNode(node: Node): node is FunctionDeclarationNode {
  return node.type === 'FunctionDeclaration';
}
