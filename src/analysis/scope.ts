import { ExportResultObj } from './analysisExport';
import { ImportResultObj } from './analysisImport';
import { allKey, ScopedId } from './constant';

export class Scope {
  readonly id: ScopedId;
  private _var: string[] = [];
  private _lexical: string[] = [];
  private functions: string[] = [];

  constructor(id: ScopedId) {
    this.id = id;
  }

  pushByImportResultObj(obj: ImportResultObj) {
    for (const key in obj) {
      if (this._var.indexOf(key) === -1) {
        this._var.push(key);
      }
    }
  }

  pushByExportResultObj(obj: ExportResultObj) {
    for (const key in obj) {
      if (key === allKey) {
        continue;
      }
      if (this._var.indexOf(key) === -1) {
        this._var.push(key);
      }
    }
  }
}

export class ScopeStack {
  private _scopes: Scope[] = [];

  get length() {
    return this._scopes.length;
  }

  push(scope: Scope): void {
    this._scopes.push(scope);
  }

  pop(): Scope | undefined {
    return this._scopes.pop();
  }

  /** 通过scope index 进行搜索 */
  findScope(index: number) {
    return this._scopes[index];
  }

  findVar() {

  }
}
