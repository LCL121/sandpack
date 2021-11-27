import { IAnalysisResult } from '../analysis/analysisResult';
import analysis from '../analysis';
import { LoadFunctionOption } from './type';

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

  constructor(code: string, id: string) {
    this.code = code;
    this.id = id;
  }

  get parsed() {
    return this._parsed;
  }

  parse() {
    this._data = analysis(this.code, this.id);
    this._parsed = true;
  }

  findImport(local: string) {
    if (this._parsed === false) {
      this.parse();
    }
    if (this._data !== null) {
      return this._data.imports[local];
    }
  }
}

export interface StateFiles {
  [key: string]: StateFile;
}

export class CoreState {
  private readonly _alias: StateAlias;
  private readonly _load: LoadFunctionOption;
  private _files: StateFiles = {};

  constructor(alias: StateAlias, load: LoadFunctionOption) {
    this._alias = alias;
    this._load = load;
  }

  aliasState(key: string) {
    return this._alias[key].loaded;
  }

  updateAlias(key: string) {
    this._alias[key].loaded = true;
  }

  loadFile(fileName: string) {
    const { code, id } = this._load(fileName);
    this.addFile(fileName, id, code);
  }

  addFile(fileName: string, id: string, code: string) {
    this._files[fileName] = new StateFile(code, id);
  }

  getFile(fileName: string) {
    return this._files[fileName];
  }
}
