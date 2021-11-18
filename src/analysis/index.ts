import { Node } from 'acorn';
import { isProgramNode, ProgramNode } from '../nodes/programNode';
import { isImportDeclarationNode } from '../nodes/importNode';
import { merge } from '../utils/object';
import { throwError } from '../utils/throw';
import { analysisImportDeclaration, ImportResultObj } from './analysisImport';
import { Scope, ScopeStack } from './scope';
import { ExportTypes, isExportAllDeclarationNode, isExportDefaultDeclarationNode, isExportNamedDeclarationNode } from '../nodes/exportNode';
import { analysisExportAllDeclarationNode, analysisExportDefaultDeclarationNode, analysisExportNamedDeclarationNode, ExportResultObj } from './analysisExport';

function analysisTopLevel(ast: ProgramNode): AnalysisResult {
  // 作用域栈
  const scopes = new ScopeStack();
  const globalScope = new Scope();
  scopes.push(globalScope);

  const result: AnalysisResult = Object.create(null);
  for (const node of ast.body) {
    if (isImportDeclarationNode(node)) {
      result.imports = merge<ImportResultObj>(false, result.imports, analysisImportDeclaration(node));
    } else if (isExportAllDeclarationNode(node)) {
      result.exports = merge<ExportResultObj>(true, result.exports, analysisExportAllDeclarationNode(node));
    } else if (isExportDefaultDeclarationNode(node)) {
      result.exports = merge<ExportResultObj>(false, result.exports, analysisExportDefaultDeclarationNode(node))
    } else if (isExportNamedDeclarationNode(node)) {
      result.exports = merge<ExportResultObj>(false, result.exports, analysisExportNamedDeclarationNode(node));
    }
  }

  return result;
}

interface AnalysisResult {
  imports: ImportResultObj;
  exports: ExportResultObj;
  data: any;
}

export default function (ast: Node): AnalysisResult | null {
  if (!isProgramNode(ast)) {
    throwError('AST without Program Node');
  } else {
    return analysisTopLevel(ast);
  }
  return null;
}
