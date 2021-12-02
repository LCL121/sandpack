import { Node } from 'acorn';
import { ClassDeclarationNode, FunctionDeclarationNode, VariableDeclarationNode } from './declarationNode';
import { ExpressionNode } from './expressionNodes';
import { SourceNode, IdentifierNode } from './sharedNodes';

export enum ExportTypes {
  ExportDefaultDeclarationType = 'ExportDefaultDeclaration',
  ExportAllDeclarationType = 'ExportAllDeclaration',
  ExportNamedDeclarationType = 'ExportNamedDeclaration'
}

export interface ExportAllDeclarationNode extends Node {
  type: ExportTypes.ExportAllDeclarationType;
  source: SourceNode;
  exported: IdentifierNode | null;
}

export function isExportAllDeclarationNode(node: Node): node is ExportAllDeclarationNode {
  return node.type === ExportTypes.ExportAllDeclarationType;
}

interface AnonymousDefaultExportedFunctionDeclaration extends Omit<FunctionDeclarationNode, 'id'> {
  id: null;
}

interface AnonymousDefaultExportedClassDeclaration extends Omit<ClassDeclarationNode, 'id'> {
  id: null;
}

export interface ExportDefaultDeclarationNode extends Node {
  type: ExportTypes.ExportDefaultDeclarationType;
  declaration:
    | FunctionDeclarationNode
    | AnonymousDefaultExportedFunctionDeclaration
    | ClassDeclarationNode
    | AnonymousDefaultExportedClassDeclaration
    | ExpressionNode;
}

export function isExportDefaultDeclarationNode(node: Node): node is ExportDefaultDeclarationNode {
  return node.type === ExportTypes.ExportDefaultDeclarationType;
}

interface ExportSpecifierNode extends Node {
  type: 'ExportSpecifier';
  local: IdentifierNode;
  exported: IdentifierNode;
}

/**
 * declaration 与specifiers 不会同时存在
 * declaration 与source 不会同时存在
 */
export interface ExportNamedDeclarationNode extends Node {
  type: ExportTypes.ExportNamedDeclarationType;
  declaration: null | VariableDeclarationNode | FunctionDeclarationNode;
  specifiers: ExportSpecifierNode[];
  source: SourceNode | null;
}

export function isExportNamedDeclarationNode(node: Node): node is ExportNamedDeclarationNode {
  return node.type === ExportTypes.ExportNamedDeclarationType;
}
