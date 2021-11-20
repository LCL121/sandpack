import { Node } from "acorn";
import { isClassDeclarationNode, isVariableDeclarationNode, isFunctionDeclarationNode } from "../nodes/declarationNode";
import { analysisPattern } from "./utils";

export function analysisNode(node: Node) {
  const resultObj: IdentifiersObj = {};
  if (isVariableDeclarationNode(node)) {
    for (const declaration of node.declarations) {
      for (const { local } of analysisPattern(declaration.id)) {
        resultObj[local] = {
          code: '',
          dependencies: [],
          id: '',
          used: false
        }
      }
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
  dependencies: string[] | Dependency[];
  id: string;
  used: boolean;
}

interface Dependency {
  value: string;
  attributes: string[];
}
