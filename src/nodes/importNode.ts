import { Node } from 'acorn';
import { IdentifierNode, SourceNode } from './sharedNodes';

export const importTypes = ['ImportDefaultSpecifier', 'ImportSpecifier', 'ImportNamespaceSpecifier'] as const;

export type ImportTypes = typeof importTypes[number];

export interface ImportDefaultSpecifierNode extends Node {
  type: 'ImportDefaultSpecifier';
  local: IdentifierNode;
}

export interface ImportSpecifierNode extends Node {
  type: 'ImportSpecifier';
  local: IdentifierNode;
  imported: IdentifierNode;
}

export function isImportSpecifierNode(node: Node): node is ImportSpecifierNode {
  return node.type === 'ImportSpecifier';
}

export interface ImportNamespaceSpecifierNode extends Node {
  type: 'ImportNamespaceSpecifier';
  local: IdentifierNode;
}

export interface ImportDeclarationNode extends Node {
  type: 'ImportDeclaration';
  specifiers: [ImportDefaultSpecifierNode | ImportSpecifierNode | ImportNamespaceSpecifierNode];
  source: SourceNode;
}

export function isImportDeclarationNode(node: Node): node is ImportDeclarationNode {
  return node.type === 'ImportDeclaration';
}
