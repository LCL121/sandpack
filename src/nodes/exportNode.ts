import { Node } from 'acorn';
import { SourceNode, IdentifierNode } from './sharedNodes';

export const exportTypes = ['ExportDefaultDeclaration', 'ExportAllDeclaration', 'ExportNamedDeclaration'] as const;

export type ExportTypes = typeof exportTypes[number];

export interface ExportAllDeclarationNode extends Node {
  type: 'ExportAllDeclaration';
  source: SourceNode;
  exported?: IdentifierNode;
}

export function isExportAllDeclarationNode(node: Node): node is ExportAllDeclarationNode {
  return node.type === 'ExportAllDeclaration';
}

interface ExportDefaultDeclarationNode extends Node {
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
interface ExportNamedDeclarationNode extends Node {
  type: 'ExportNamedDeclaration';
  declaration: null | any;
  specifiers: ExportSpecifierNode[] | null;
  source: SourceNode | null;
}

export function isExportNamedDeclarationNode(node: Node): node is ExportNamedDeclarationNode {
  return node.type === 'ExportNamedDeclaration';
}
