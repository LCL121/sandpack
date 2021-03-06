import { Node } from 'acorn';
import { ExpressionNode, FunctionExpressionNode } from './expressionNodes';
import { PatternNode } from './patternNode';
import { IdentifierNode, PrivateIdentifierNode } from './sharedNodes';
import { BlockStatementNode, FunctionBodyNode } from './statementNodes';

export enum DeclarationTypes {
  VariableDeclarationType = 'VariableDeclaration',
  FunctionDeclarationType = 'FunctionDeclaration',
  ClassDeclarationType = 'ClassDeclaration'
}

export type DeclarationNode = VariableDeclarationNode | FunctionDeclarationNode | ClassDeclarationNode;

export interface VariableDeclaratorNode extends Node {
  type: 'VariableDeclarator';
  id: PatternNode;
  init: ExpressionNode | null;
}

export interface VariableDeclarationNode extends Node {
  type: DeclarationTypes.VariableDeclarationType;
  kind: 'var' | 'let' | 'const';
  declarations: VariableDeclaratorNode[];
}

export function isVariableDeclarationNode(node: Node): node is VariableDeclarationNode {
  return node.type === DeclarationTypes.VariableDeclarationType;
}

export interface FunctionDeclarationNode extends Node {
  type: DeclarationTypes.FunctionDeclarationType;
  id: IdentifierNode;
  params: PatternNode[];
  body: FunctionBodyNode;
}

export function isFunctionDeclarationNode(node: Node): node is FunctionDeclarationNode {
  return node.type === DeclarationTypes.FunctionDeclarationType;
}

enum ClassPropertyDefinitionNode {
  PropertyDefinitionType = 'PropertyDefinition',
  MethodDefinitionType = 'MethodDefinition'
}

interface ClassNode extends Node {
  id: IdentifierNode | null;
  superClass: ExpressionNode | null;
  body: ClassBodyNode;
}

interface ClassBodyNode extends Node {
  body: (MethodDefinitionNode | PropertyDefinitionNode | StaticBlockNode)[];
}

interface PropertyDefinitionNode extends Node {
  type: ClassPropertyDefinitionNode.PropertyDefinitionType;
  key: ExpressionNode | PrivateIdentifierNode;
  value: ExpressionNode | null;
  computed: boolean;
  static: boolean;
}

export function isPropertyDefinitionNode(node: Node): node is PropertyDefinitionNode {
  return node.type === ClassPropertyDefinitionNode.PropertyDefinitionType;
}

interface MethodDefinitionNode extends Node {
  type: ClassPropertyDefinitionNode.MethodDefinitionType;
  key: ExpressionNode | PrivateIdentifierNode;
  value: FunctionExpressionNode;
  kind: 'constructor' | 'method' | 'get' | 'set';
  computed: boolean;
  static: boolean;
}

export function isMethodDefinitionNode(node: Node): node is MethodDefinitionNode {
  return node.type === ClassPropertyDefinitionNode.MethodDefinitionType;
}

interface StaticBlockNode extends Omit<BlockStatementNode, 'type'> {
  type: 'StaticBlock';
}

export interface ClassDeclarationNode extends ClassNode {
  type: DeclarationTypes.ClassDeclarationType;
  id: IdentifierNode;
}

export function isClassDeclarationNode(node: Node): node is ClassDeclarationNode {
  return node.type === DeclarationTypes.ClassDeclarationType;
}
