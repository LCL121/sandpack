import { LoadFunctionOption } from './type';
import { topologicalSort } from '../utils/utils';
import { useAllStatements } from './useStatement';
import { StateFile } from './fileState';
import { relativeToAbsolute } from './utils';

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
    this._entry = relativeToAbsolute('/', entry);
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

  loadFile(filePath: string) {
    if (this._files[filePath] === undefined) {
      const loadFileInfo = this._load(filePath);
      if (loadFileInfo) {
        this.addFile(filePath, loadFileInfo.id, loadFileInfo.code);
      } else {
        throw Error(`${filePath} is not exist`);
      }
    }
  }

  /**
   * 对应file/code set undefined
   */
  resetFile(filePath: string, strict = false) {
    this._files[filePath] = undefined;
    this._code[filePath].identifiers = [];
    this._code[filePath].statements = [];
    this._builded = false;

    if (strict) {
      this.resetRelationFile(filePath);
    } else {
      for (const file in this._files) {
        const dependencies = this._files[file]?.dependencies;
        if (dependencies && dependencies.includes(filePath)) {
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
  resetRelationFile(filePath: string) {
    const needResetFiles: string[] = [];
    for (const file in this._files) {
      const dependencies = this._files[file]?.dependencies;
      if (dependencies && dependencies.includes(filePath)) {
        needResetFiles.push(file);
      }
    }

    for (const needResetFile of needResetFiles) {
      const fileState = this.getFile(needResetFile);
      let tmpIdentifiers = fileState.findImportNamesBySource(filePath);
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

  addFile(filePath: string, id: string, code: string) {
    if (this._files[filePath] === undefined) {
      this._files[filePath] = new StateFile(code, id);
    }
  }

  getFile(filePath: string) {
    this.hasFile(filePath);
    return this._files[filePath]!;
  }

  hasFile(filePath: string) {
    if (this._files[filePath] === undefined) {
      throw Error(`${filePath} not loaded`);
    }
    return true;
  }

  isFileEmptyExports(filePath: string) {
    return this.getFile(filePath).isEmptyExports();
  }

  addCode(filePath: string, code: string, index?: number) {
    if (this._code[filePath] === undefined) {
      this._code[filePath] = {
        identifiers: [],
        statements: []
      };
    }
    if (index === undefined) {
      this._code[filePath].identifiers.push(code);
    } else {
      this._code[filePath].statements.splice(index, 0, code);
    }
  }

  /**
   * 文件依赖的添加
   */
  addFileDependencies(filePath: string, ...dependencies: string[]) {
    this.getFile(filePath).addDependencies(...dependencies);
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
