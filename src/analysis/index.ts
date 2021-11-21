import { Node } from 'acorn';
import { isProgramNode, ProgramNode } from '../nodes/programNode';
import { isImportDeclarationNode } from '../nodes/importNode';
import { throwError } from '../utils/throw';
import { analysisImportDeclaration } from './analysisImport';
import {
  isExportAllDeclarationNode,
  isExportDefaultDeclarationNode,
  isExportNamedDeclarationNode
} from '../nodes/exportNode';
import {
  analysisExportAllDeclarationNode,
  analysisExportDefaultDeclarationNode,
  analysisExportNamedDeclarationNode
} from './analysisExport';
import { analysisNode } from './analysisNode';
import { AnalysisResult } from './analysisResult';
import { ScopedId } from './constant';
import { AnalysisState } from './analysisState';

function analysisTopLevel(ast: ProgramNode): AnalysisResult {
  const globalState = new AnalysisState();
  globalState.pushScope(ScopedId.topScopeId);

  const result = new AnalysisResult();

  for (const node of ast.body) {
    if (isImportDeclarationNode(node)) {
      const obj = analysisImportDeclaration(node);
      result.addImports(false, obj);
      globalState.topScope().pushByImportResultObj(obj);
    } else if (isExportDefaultDeclarationNode(node)) {
      const obj = analysisExportDefaultDeclarationNode(node);
      result.addExports(false);
      globalState.topScope().pushByExportResultObj(obj);
    } else if (isExportNamedDeclarationNode(node)) {
      const obj = analysisExportNamedDeclarationNode(node);
      result.addExports(false, obj);
      globalState.topScope().pushByExportResultObj(obj);
    } else if (isExportAllDeclarationNode(node)) {
      const obj = analysisExportAllDeclarationNode(node);
      result.addExports(true, obj);
      globalState.topScope().pushByExportResultObj(obj);
    } else {
      analysisNode(node, result, globalState);
    }
  }

  globalState.popScope();

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
