import { parse } from 'acorn';
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
import { AnalysisResult, IAnalysisResult } from './analysisResult';
import { ScopedId } from './constant';
import { AnalysisState } from './analysisState';
import windowVars from '../utils/window';
import jsVars from '../utils/js';

function analysisTopLevel(ast: ProgramNode, code: string, fileId: string): AnalysisResult {
  const globalState = new AnalysisState(code, fileId);
  globalState.pushScope(ScopedId.topScopeId);
  globalState.topScope().push(...windowVars);
  globalState.topScope().push(...jsVars);

  const result = new AnalysisResult();

  for (const node of ast.body) {
    if (isImportDeclarationNode(node)) {
      result.addImports(false, analysisImportDeclaration(node));
    } else if (isExportDefaultDeclarationNode(node)) {
      result.addExports(false, analysisExportDefaultDeclarationNode(node));
    } else if (isExportNamedDeclarationNode(node)) {
      result.addExports(false, analysisExportNamedDeclarationNode(node, result, globalState));
    } else if (isExportAllDeclarationNode(node)) {
      result.addExports(true, analysisExportAllDeclarationNode(node));
    } else {
      analysisNode(node, result, globalState);
    }
  }

  globalState.popScope();

  return result;
}

export default function (source: string, fileId: string): IAnalysisResult | null {
  const ast = parse(source, {
    sourceType: 'module',
    ecmaVersion: 2020
  });
  if (!isProgramNode(ast)) {
    throwError('AST without Program Node');
  } else {
    return analysisTopLevel(ast, source, fileId).result;
  }
  return null;
}
