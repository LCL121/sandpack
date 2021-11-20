import { Node } from 'acorn';
import { FunctionDeclarationNode, VariableDeclarationNode } from './declarationNode';
import { SourceNode, IdentifierNode } from './sharedNodes';

export const exportTypes = ['ExportDefaultDeclaration', 'ExportAllDeclaration', 'ExportNamedDeclaration'] as const;

export type ExportTypes = typeof exportTypes[number];

export interface ExportAllDeclarationNode extends Node {
  type: 'ExportAllDeclaration';
  source: SourceNode;
  exported: IdentifierNode | null;
}

export function isExportAllDeclarationNode(node: Node): node is ExportAllDeclarationNode {
  return node.type === 'ExportAllDeclaration';
}

export interface ExportDefaultDeclarationNode extends Node {
  type: 'ExportDefaultDeclaration';
  declaration: IdentifierNode;
}

export function isExportDefaultDeclarationNode(node: Node): node is ExportDefaultDeclarationNode {
  return node.type === 'ExportDefaultDeclaration';
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
  type: 'ExportNamedDeclaration';
  declaration: null | VariableDeclarationNode | FunctionDeclarationNode;
  specifiers: ExportSpecifierNode[];
  source: SourceNode | null;
}

export function isExportNamedDeclarationNode(node: Node): node is ExportNamedDeclarationNode {
  return node.type === 'ExportNamedDeclaration';
}
