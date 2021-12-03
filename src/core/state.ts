import { IAnalysisResult } from '../analysis/analysisResult';
import analysis from '../analysis';
import { LoadFunctionOption } from './type';
import { isNumber } from '../utils/type';
import { AnalysisStatementNodeResult } from '../analysis/analysisNode';
import { allKey } from '../analysis/constant';
import { topologicalSort } from '../utils/utils';

export interface StatePath {
  origin: string;
  loaded: boolean;
}

export interface StateAlias {
  [key: string]: StatePath;
}

class StateFile {
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

  addDependencies(...dependencies: string[]) {
    for (const dependency of dependencies) {
      this._dependencies.add(dependency);
    }
  }
}

export interface StateFiles {
  [key: string]: StateFile;
}

interface StateCode {
  [key: string]: {
    identifiers: string[];
    statements: string[];
  };
}

export class CoreState {
  private _code: StateCode = {};
  private readonly _alias: StateAlias;
  private readonly _load: LoadFunctionOption;
  private _files: StateFiles = {};

  constructor(alias: StateAlias, load: LoadFunctionOption) {
    this._alias = alias;
    this._load = load;
  }

  get code() {
    const base: string[] = [];
    const dependencies: [string, string][] = [];
    for (const file in this._files) {
      base.push(file);
      for (const dependency of this._files[file].dependencies) {
        dependencies.push([dependency, file]);
      }
    }
    const sortResult = topologicalSort(base, dependencies);
    let identifiers = '';
    let statements = '';
    for (const key of sortResult) {
      identifiers = identifiers + this._code[key].identifiers.join('');
      statements = statements + this._code[key].statements.join('');
    }
    return identifiers + statements;
  }

  aliasState(key: string) {
    return this._alias[key].loaded;
  }

  updateAlias(key: string) {
    this._alias[key].loaded = true;
  }

  loadFile(fileName: string) {
    if (this._files[fileName] === undefined) {
      const { code, id } = this._load(fileName);
      this.addFile(fileName, id, code);
    }
  }

  addFile(fileName: string, id: string, code: string) {
    if (this._files[fileName] === undefined) {
      this._files[fileName] = new StateFile(code, id);
    }
  }

  getFile(fileName: string) {
    return this._files[fileName];
  }

  isFileEmptyExports(fileName: string) {
    return this.getFile(fileName).isEmptyExports();
  }

  addCode(fileName: string, code: string, index?: number) {
    if (this._code[fileName] === undefined) {
      this._code[fileName] = {
        identifiers: [],
        statements: []
      };
    }
    if (index === undefined) {
      this._code[fileName].identifiers.push(code);
    } else {
      this._code[fileName].statements.splice(index, 0, code);
    }
  }

  /**
   * 文件依赖的添加
   */
  addFileDependencies(fileName: string, ...dependencies: string[]) {
    this._files[fileName].addDependencies(...dependencies);
  }
}
