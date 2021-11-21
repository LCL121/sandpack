import { arrayPush, isEmptyArray } from '../utils/array';
import { merge } from '../utils/object';
import { isString } from '../utils/type';
import { ExportResultObj } from './analysisExport';
import { ImportResultObj } from './analysisImport';
import { AnalysisIdentifierNodeObj, AnalysisNodeResult, AnalysisStatementNodeObj } from './analysisNode';
import { allKey } from './constant';

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
