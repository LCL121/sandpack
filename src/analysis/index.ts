import { Node } from 'acorn';
import { isProgramNode, ProgramNode } from '../nodes/programNode';
import { isImportDeclarationNode } from '../nodes/importNode';
import { merge } from '../utils/object';
import { throwError } from '../utils/throw';
import { analysisImportDeclaration, ImportResultObj } from './analysisImport';
import { Scope, ScopeStack } from './scope';
import {
  isExportAllDeclarationNode,
  isExportDefaultDeclarationNode,
  isExportNamedDeclarationNode
} from '../nodes/exportNode';
import {
  allKey,
  analysisExportAllDeclarationNode,
  analysisExportDefaultDeclarationNode,
  analysisExportNamedDeclarationNode,
  ExportResultObj
} from './analysisExport';
import { analysisNode, AnalysisIdentifierNodeObj, AnalysisStatementNodeObj, AnalysisNodeResult } from './analysisNode';
import { isString } from '../utils/type';
import { arrayPush, isEmptyArray } from '../utils/array';

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

export class AnalysisResult {
  private imports: ImportResultObj = {};
  private exports: ExportResultObj = {
    [allKey]: []
  };
  private identifiers: AnalysisIdentifierNodeObj = {};
  private statements: AnalysisStatementNodeObj = {
    statements: []
  };

  addImports(isMergeObj: boolean, ...imports: ImportResultObj[]) {
    this.imports = merge<ImportResultObj>(isMergeObj, this.imports, ...imports);
  }

  addExports(isMergeObj: boolean, ...exports: ExportResultObj[]) {
    this.exports = merge<ExportResultObj>(isMergeObj, this.exports, ...exports);
  }

  addStatements(...statements: AnalysisNodeResult[]) {
    for (const statement of statements) {
      if (isEmptyArray(statement.dependencies)) {
        continue;
      }
      this.statements.statements.push(statement);
      for (const dependency of statement.dependencies) {
        if (isString(dependency)) {
          this.statements[dependency] = arrayPush<number>(
            this.statements.statements.length - 1,
            this.statements[dependency] as number[]
          );
        } else {
          this.statements[dependency.value] = arrayPush<number>(
            this.statements.statements.length - 1,
            this.statements[dependency.value] as number[]
          );
        }
      }
    }
  }
}

export default function (ast: Node): AnalysisResult | null {
  if (!isProgramNode(ast)) {
    throwError('AST without Program Node');
  } else {
    return analysisTopLevel(ast);
  }
  return null;
}
