import { Node } from 'acorn';
import { ExpressionNode } from './expressionNodes';
import { PatternNode } from './patternNode';
import { BlockStatementNode, FunctionBodyNode } from './statementNodes';

export interface SourceNode extends LiteralNode {
  value: string;
  raw: string;
}

export interface IdentifierNode extends Node {
  type: 'Identifier';
  name: string;
}

export function isIdentifierNode(node: Node): node is IdentifierNode {
  return node.type === 'Identifier';
}

export interface VariableDeclarationNode extends Node {
  type: 'VariableDeclaration';
  kind: 'var' | 'let' | 'const';
  declarations: VariableDeclaratorNode[];
}

export function isVariableDeclarationNode(node: Node): node is VariableDeclarationNode {
  return node.type === 'VariableDeclaration';
}

export interface VariableDeclaratorNode extends Node {
  type: 'VariableDeclarator';
  id: PatternNode;
  init: ExpressionNode;
}

export interface LiteralNode extends ExpressionNode {
  type: 'Literal';
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

interface ClassNode extends Node {
  id: IdentifierNode | null;
  superClass: ExpressionNode | null;
  body: ClassBodyNode;
}

interface ClassBodyNode extends Node {
  body: [MethodDefinitionNode | PropertyDefinitionNode | StaticBlockNode];
}

interface PropertyDefinitionNode extends Node {
  type: 'PropertyDefinition';
  key: ExpressionNode | PrivateIdentifierNode;
  value: ExpressionNode | null;
  computed: boolean;
  static: boolean;
}

interface MethodDefinitionNode extends Node {
  key: ExpressionNode | PrivateIdentifierNode;
}

interface PrivateIdentifierNode extends Node {
  type: 'PrivateIdentifier';
  name: string;
}

interface StaticBlockNode extends Omit<BlockStatementNode, 'type'> {
  type: 'StaticBlock';
}

export interface ClassDeclarationNode extends ClassNode {
  type: 'ClassDeclaration';
  id: IdentifierNode;
}

export function isClassDeclarationNode(node: Node): node is ClassDeclarationNode {
  return node.type === 'ClassDeclaration';
}
