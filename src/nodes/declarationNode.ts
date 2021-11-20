import { Node } from 'acorn';
import { ExpressionNode } from './expressionNodes';
import { PatternNode } from './patternNode';
import { IdentifierNode, PrivateIdentifierNode } from './sharedNodes';
import { BlockStatementNode, FunctionBodyNode } from './statementNodes';

enum DeclarationTypes {
  VariableDeclarationType = 'VariableDeclaration',
  FunctionDeclarationType = 'FunctionDeclaration',
  ClassDeclarationType = 'ClassDeclaration'
}

export interface VariableDeclaratorNode extends Node {
  type: 'VariableDeclarator';
  id: PatternNode;
  init: ExpressionNode;
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
  params: IdentifierNode[];
  body: FunctionBodyNode;
}

export function isFunctionDeclarationNode(node: Node): node is FunctionDeclarationNode {
  return node.type === DeclarationTypes.FunctionDeclarationType;
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
