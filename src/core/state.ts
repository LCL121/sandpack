import { LoadFunctionOption } from './type';
import { topologicalSort } from '../utils/utils';
import { useAllStatements } from './useStatement';
import { StateFile } from './fileState';

export interface StatePath {
  origin: string;
  loaded: boolean;
}

export interface StateAlias {
  [key: string]: StatePath;
}

export interface StateFiles {
  [key: string]: StateFile | undefined;
}

interface StateCode {
  [key: string]: {
    identifiers: string[];
    statements: string[];
  };
}

export class CoreState {
  private readonly _entry: string;
  private _builded: boolean;
  private _code: StateCode = {};
  private readonly _alias: StateAlias;
  private readonly _load: LoadFunctionOption;
  private _files: StateFiles = {};

  constructor(entry: string, alias: StateAlias, load: LoadFunctionOption) {
    this._entry = entry;
    this._alias = alias;
    this._load = load;
    this._builded = false;
  }

  get code() {
    if (this._builded === false) {
      this.run();
    }
    const base: string[] = [];
    const dependencies: [string, string][] = [];
    for (const file in this._files) {
      this.hasFile(file);
      base.push(file);
      for (const dependency of this._files[file]!.dependencies) {
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

  /**
   * 对应file/code set undefined
   */
  resetFile(fileName: string, strict = false) {
    this._files[fileName] = undefined;
    this._code[fileName].identifiers = [];
    this._code[fileName].statements = [];
    this._builded = false;

    if (strict) {
      this.resetRelationFile(fileName);
    } else {
      for (const file in this._files) {
        const dependencies = this._files[file]?.dependencies;
        if (dependencies && dependencies.includes(fileName)) {
          this.resetFile(file);
        }
      }
    }
  }

  /**
   * 1. 对应file/code set undefined
   * 2. 找到所有依赖该file 的受依赖file
   * 3. 找到受依赖file imports中source 为该file 的变量
   * 4. 找到依赖该变量的identifiers/statements 将其used 改为false
   * 5. 找到受该变量依赖的其他文件中的identifiers/statements
   * TODO 有难度
   */
  resetRelationFile(fileName: string) {
    const needResetFiles: string[] = [];
    for (const file in this._files) {
      const dependencies = this._files[file]?.dependencies;
      if (dependencies && dependencies.includes(fileName)) {
        needResetFiles.push(file);
      }
    }

    for (const needResetFile of needResetFiles) {
      const fileState = this.getFile(needResetFile);
      let tmpIdentifiers = fileState.findImportNamesBySource(fileName);
      const needIdentifiers: string[] = [];
      while (tmpIdentifiers.length > 0) {
        needIdentifiers.push(...tmpIdentifiers);
        fileState.resetStatementByDependencies(tmpIdentifiers);
        tmpIdentifiers = fileState.resetIdentifiersByDependencies(tmpIdentifiers);
      }
      console.log(needIdentifiers);
      // TODO 需要找到本文件中依赖needIdentifiers/statements 的变量，找到export 的对应变量
    }
  }

  addFile(fileName: string, id: string, code: string) {
    if (this._files[fileName] === undefined) {
      this._files[fileName] = new StateFile(code, id);
    }
  }

  getFile(fileName: string) {
    this.hasFile(fileName);
    return this._files[fileName]!;
  }

  hasFile(fileName: string) {
    if (this._files[fileName] === undefined) {
      throw Error(`${fileName} not loaded`);
    }
    return true;
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
    this.getFile(fileName).addDependencies(...dependencies);
  }

  run() {
    if (this._builded === false) {
      this.loadFile(this._entry);
      if (this.isFileEmptyExports(this._entry)) {
        this.buildDefaultFile(this._entry);
      } else {
        // TODO
      }
      this._builded = true;
    }
  }

  buildDefaultFile(entry: string) {
    useAllStatements(this, entry);
  }

  buildModuleFile() {}
}
