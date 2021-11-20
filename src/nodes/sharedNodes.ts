import { Node } from 'acorn';
import { ExpressionNode } from './expressionNodes';
import { PatternNode } from './patternNode';
import { FunctionBodyNode } from './statementNodes';

export interface SourceNode extends LiteralNode {
  value: string;
  raw: string;
}

export interface IdentifierNode extends Node {
  type: 'Identifier';
  name: string;
}

export interface PrivateIdentifierNode extends Node {
  type: 'PrivateIdentifier';
  name: string;
}

export function isIdentifierNode(node: Node): node is IdentifierNode {
  return node.type === 'Identifier';
}

export interface LiteralNode extends Node {
  type: 'Literal';
  value: string | boolean | null | number | RegExp;
  raw: string;
}

export function isLiteralNode(node: Node): node is LiteralNode {
  return node.type === 'Literal';
}

export interface PropertyNode extends Node {
  type: 'Property';
  key: LiteralNode | IdentifierNode;
  value: ExpressionNode;
  kind: 'init' | 'get' | 'set';
}

export interface FunctionNode extends Node {
  id: IdentifierNode | null;
  params: PatternNode[];
  body: FunctionBodyNode;
  async: boolean;
}

export interface TemplateLiteralNode extends Node {
  type: 'TemplateLiteral';
  quasis: TemplateElementNode[];
  expressions: ExpressionNode[];
}

interface TemplateElementNode extends Node {
  type: 'TemplateElement';
  tail: boolean;
  value: {
    cooked: string | null;
    raw: string;
  };
}

interface BigIntLiteral extends LiteralNode {
  bigint: string;
}
