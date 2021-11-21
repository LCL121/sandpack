import { Node } from 'acorn';
import { isProgramNode, ProgramNode } from '../nodes/programNode';
import { isImportDeclarationNode } from '../nodes/importNode';
import { throwError } from '../utils/throw';
import { analysisImportDeclaration } from './analysisImport';
import { Scope, ScopeStack } from './scope';
import {
  isExportAllDeclarationNode,
  isExportDefaultDeclarationNode,
  isExportNamedDeclarationNode
} from '../nodes/exportNode';
import {
  analysisExportAllDeclarationNode,
  analysisExportDefaultDeclarationNode,
  analysisExportNamedDeclarationNode,
} from './analysisExport';
import { analysisNode } from './analysisNode';
import { AnalysisResult } from './analysisResult';

function analysisTopLevel(ast: ProgramNode): AnalysisResult {
  // 作用域栈
  const scopes = new ScopeStack();
  const globalScope = new Scope();
  scopes.push(globalScope);

  const result = new AnalysisResult();
  for (const node of ast.body) {
    if (isImportDeclarationNode(node)) {
      result.addImports(false, analysisImportDeclaration(node));
    } else if (isExportDefaultDeclarationNode(node)) {
      result.addExports(false, analysisExportDefaultDeclarationNode(node));
    } else if (isExportNamedDeclarationNode(node)) {
      result.addExports(false, analysisExportNamedDeclarationNode(node));
    } else if (isExportAllDeclarationNode(node)) {
      result.addExports(true, analysisExportAllDeclarationNode(node));
    } else {
      analysisNode(node, result);
    }
  }

  return result;
}

export default function (ast: Node): AnalysisResult | null {
  if (!isProgramNode(ast)) {
    throwError('AST without Program Node');
  } else {
    return analysisTopLevel(ast);
  }
  return null;
}
