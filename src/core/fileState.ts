import analysis from '../analysis';
import { AnalysisStatementNodeResult } from '../analysis/analysisNode';
import { IAnalysisResult } from '../analysis/analysisResult';
import { allKey } from '../analysis/constant';
import { isNumber } from '../utils/type';
import { getDependency } from '../utils/utils';

export class StateFile {
  readonly code: string;
  readonly id: string;
  private _parsed: boolean = false;
  private _data: IAnalysisResult | null = null;
  private _dependencies = new Set<string>();

  constructor(code: string, id: string) {
    this.code = code;
    this.id = id;
  }

  get parsed() {
    return this._parsed;
  }

  get allStatements() {
    return this._data && this._data.statements;
  }

  get dependencies() {
    return Array.from(this._dependencies);
  }

  parse() {
    if (this._parsed === false) {
      this._data = analysis(this.code, this.id);
      this._parsed = true;
    }
  }

  isEmptyExports() {
    this.parse();
    if (
      this._data &&
      Object.keys(this._data.exports).length === 1 &&
      this._data.exports.EXPORT_ALL_KEY_SANDPACK.length === 0
    ) {
      return true;
    }
    return false;
  }

  findImport(local: string) {
    this.parse();
    if (this._data !== null) {
      return this._data.imports[local];
    }
  }

  findImportNamesBySource(source: string) {
    this.parse();
    const result: string[] = [];
    if (this._data !== null) {
      for (const local in this._data.imports) {
        if (this._data.imports[local].source === source) {
          result.push(local);
        }
      }
    }
    return result;
  }

  /**
   * 查找exported
   * 1. 先找单个exported
   * 2. 返回allKey 中exported
   */
  findExported(exported: string) {
    this.parse();
    if (this._data !== null) {
      if (exported !== allKey && this._data.exports[exported]) {
        return this._data.exports[exported];
      } else if (this._data.exports.EXPORT_ALL_KEY_SANDPACK.length > 0) {
        return this._data.exports.EXPORT_ALL_KEY_SANDPACK;
      }
    }
  }

  findIdentifier(identifier: string) {
    this.parse();
    if (this._data !== null) {
      return this._data.identifiers[identifier];
    }
  }

  resetIdentifiersByDependencies(dependencies: string[]) {
    this.parse();
    const result: string[] = [];
    if (this._data !== null) {
      for (const identifier in this._data.identifiers) {
        for (const item of this._data.identifiers[identifier].dependencies) {
          const dependency = getDependency(item);
          if (dependencies.includes(dependency)) {
            if (this._data.identifiers[identifier].used) {
              this._data.identifiers[identifier].used = false;
              result.push(identifier);
            }
            break;
          }
        }
      }
    }
    return result;
  }

  findStatement(dependency: string) {
    this.parse();
    if (this._data !== null) {
      const result: AnalysisStatementNodeResult[] = [];
      if (!this._data.statements[dependency]) {
        return;
      }
      for (const index of this._data.statements[dependency]) {
        if (isNumber(index)) {
          result.push(this._data.statements.statements[index]);
        }
      }
      return result;
    }
  }

  resetStatementByDependencies(dependencies: string[]) {
    this.parse();
    if (this._data !== null) {
      for (const statement of this._data.statements.statements) {
        for (const item of statement.dependencies) {
          const dependency = getDependency(item);
          if (dependencies.includes(dependency)) {
            statement.used = false;
            break;
          }
        }
      }
    }
  }

  addDependencies(...dependencies: string[]) {
    for (const dependency of dependencies) {
      this._dependencies.add(dependency);
    }
  }
}
