import { arrayPush, isEmptyArray } from '../utils/array';
import { merge } from '../utils/object';
import { isString } from '../utils/type';
import { ExportResultObj } from './analysisExport';
import { ImportResultObj } from './analysisImport';
import { AnalysisIdentifierNodeObj, AnalysisNodeResult, AnalysisStatementNodeObj } from './analysisNode';
import { allKey } from './constant';

export class AnalysisResult {
  private _imports: ImportResultObj = {};
  private _exports: ExportResultObj = {
    [allKey]: []
  };
  private _identifiers: AnalysisIdentifierNodeObj = {};
  private _statements: AnalysisStatementNodeObj = {
    statements: []
  };

  addImports(isMergeObj: boolean, ...imports: ImportResultObj[]) {
    this._imports = merge<ImportResultObj>(isMergeObj, this._imports, ...imports);
  }

  addExports(isMergeObj: boolean, ...exports: ExportResultObj[]) {
    this._exports = merge<ExportResultObj>(isMergeObj, this._exports, ...exports);
  }

  addIdentifiers(isMergeObj: boolean, ...exports: AnalysisIdentifierNodeObj[]) {
    this._identifiers = merge<AnalysisIdentifierNodeObj>(isMergeObj, this._identifiers, ...exports);
  }

  addStatements(isTopLevelScope: boolean, ...statements: AnalysisNodeResult[]) {
    if (isTopLevelScope) {
      for (const statement of statements) {
        if (isEmptyArray(statement.dependencies)) {
          continue;
        }
        this._statements.statements.push(statement);
        for (const dependency of statement.dependencies) {
          if (isString(dependency)) {
            this._statements[dependency] = arrayPush<number>(
              this._statements.statements.length - 1,
              this._statements[dependency] as number[]
            );
          } else {
            this._statements[dependency.value] = arrayPush<number>(
              this._statements.statements.length - 1,
              this._statements[dependency.value] as number[]
            );
          }
        }
      }
    }
  }
}
