import { Node } from "acorn";
import { isClassDeclarationNode, isVariableDeclarationNode, isFunctionDeclarationNode } from "../nodes/sharedNodes";

export function analysisNode(node: Node) {
  if (isVariableDeclarationNode(node)) {
    for (const declarations of node.declarations) {
      
    }
  } else if (isFunctionDeclarationNode(node)) {

  } else if (isClassDeclarationNode(node)) {

  }
}

export interface IdentifiersObj {
  [key: string]: IdentifierResult;
}

interface IdentifierResult {
  code: string;
  dependencies: [string | Dependency];
  id: string;
  used: boolean;
}

interface Dependency {
  value: string;
  attributes: string[];
}
