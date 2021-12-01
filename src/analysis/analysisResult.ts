import { arrayPush, isEmptyArray } from '../utils/array';
import { merge } from '../utils/object';
import { getDependency } from '../utils/utils';
import { ExportResultObj } from './analysisExport';
import { ImportResultObj } from './analysisImport';
import { AnalysisIdentifierNodeObj, AnalysisStatementNodeObj, AnalysisStatementNodeResult } from './analysisNode';
import { allKey } from './constant';

export interface IAnalysisResult {
  imports: ImportResultObj;
  exports: ExportResultObj;
  identifiers: AnalysisIdentifierNodeObj;
  statements: AnalysisStatementNodeObj;
}

export class AnalysisResult {
  private _imports: ImportResultObj = {};
  private _exports: ExportResultObj = {
    [allKey]: []
  };
  private _identifiers: AnalysisIdentifierNodeObj = {};
  private _statements: AnalysisStatementNodeObj = {
    statements: []
  };

  get result(): IAnalysisResult {
    return {
      imports: this._imports,
      exports: this._exports,
      identifiers: this._identifiers,
      statements: this._statements
    };
  }

  addImports(isMergeObj: boolean, ...imports: ImportResultObj[]) {
    this._imports = merge<ImportResultObj>(isMergeObj, this._imports, ...imports);
  }

  addExports(isMergeObj: boolean, ...exports: ExportResultObj[]) {
    this._exports = merge<ExportResultObj>(isMergeObj, this._exports, ...exports);
  }

  addIdentifiers(isMergeObj: boolean, ...identifierObjs: AnalysisIdentifierNodeObj[]) {
    for (const identifierObj of identifierObjs) {
      for (const key in identifierObj) {
        identifierObj[key].dependencies = Array.from(new Set(identifierObj[key].dependencies));
      }
    }
    this._identifiers = merge<AnalysisIdentifierNodeObj>(isMergeObj, this._identifiers, ...identifierObjs);
  }

  addStatements(isTopLevelScope: boolean, ...statements: AnalysisStatementNodeResult[]) {
    if (isTopLevelScope) {
      for (const statement of statements) {
        if (isEmptyArray(statement.dependencies)) {
          continue;
        }
        // 消除statement 中重复依赖
        statement.dependencies = Array.from(new Set(statement.dependencies));
        this._statements.statements.push(statement);
        for (const dependency of statement.dependencies) {
          const key = getDependency(dependency);
          this._statements[key] = arrayPush<number>(
            this._statements.statements.length - 1,
            this._statements[key] as number[]
          );
        }
      }
    }
  }
}
