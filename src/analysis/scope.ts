import { ExportResultObj } from './analysisExport';
import { ImportResultObj } from './analysisImport';
import { allKey, ScopedId } from './constant';

export class Scope {
  private readonly id: ScopedId;
  private _var: string[] = [];
  private _lexical: string[] = [];
  private _functions: string[] = [];

  constructor(id: ScopedId) {
    this.id = id;
  }

  private _push(name: string) {
    if (this._var.indexOf(name) === -1) {
      this._var.push(name);
    }
  }

  push(...names: string[]) {
    for (const name of names) {
      this._push(name);
    }
  }

  pushByImportResultObj(obj: ImportResultObj) {
    for (const key in obj) {
      this._push(key);
    }
  }

  pushByExportResultObj(obj: ExportResultObj) {
    for (const key in obj) {
      if (key === allKey) {
        continue;
      }
      this._push(key);
    }
  }

  /**
   * 1. 遍历_lexical
   * 2. 遍历_var 和_functions
   */
  find(key: string): boolean {
    return this._lexical.includes(key) || this._functions.includes(key) || this._var.includes(key);
  }

  isTopLevelScope(): boolean {
    return this.id === ScopedId.topScopeId;
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

  /** null 表示没有对应scope */
  findVar(key: string): Scope | null {
    for (let i = this._scopes.length - 1; i >= 0; i--) {
      if (this._scopes[i].find(key)) {
        return this._scopes[i];
      }
    }
    return null;
  }
}
