import { Node } from 'acorn';
import { IdentifierNode, SourceNode } from './sharedNodes';

export enum ImportTypes {
  ImportDefaultSpecifierType = 'ImportDefaultSpecifier',
  ImportSpecifierType = 'ImportSpecifier',
  ImportNamespaceSpecifierType = 'ImportNamespaceSpecifier'
}

export interface ImportDefaultSpecifierNode extends Node {
  type: ImportTypes.ImportDefaultSpecifierType;
  local: IdentifierNode;
}

export function isImportDefaultSpecifierNode(node: Node): node is ImportDefaultSpecifierNode {
  return node.type === ImportTypes.ImportDefaultSpecifierType;
}

export interface ImportSpecifierNode extends Node {
  type: ImportTypes.ImportSpecifierType;
  local: IdentifierNode;
  imported: IdentifierNode;
}

export function isImportSpecifierNode(node: Node): node is ImportSpecifierNode {
  return node.type === ImportTypes.ImportSpecifierType;
}

export interface ImportNamespaceSpecifierNode extends Node {
  type: ImportTypes.ImportNamespaceSpecifierType;
  local: IdentifierNode;
}

export function isImportNamespaceSpecifierNode(node: Node): node is ImportNamespaceSpecifierNode {
  return node.type === ImportTypes.ImportNamespaceSpecifierType;
}

export interface ImportDeclarationNode extends Node {
  type: 'ImportDeclaration';
  specifiers: (ImportDefaultSpecifierNode | ImportSpecifierNode | ImportNamespaceSpecifierNode)[];
  source: SourceNode;
}

export function isImportDeclarationNode(node: Node): node is ImportDeclarationNode {
  return node.type === 'ImportDeclaration';
}
