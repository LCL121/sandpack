import { ScopedId } from "./constant";
import { Scope, ScopeStack } from "./scope";

export class AnalysisState {
  private _idCount = 0;
  private _scopeStack = new ScopeStack();

  uniqueIdGenerator() {
    return `sand$$${this._idCount++}`
  }

  pushScope(scopeId: ScopedId) {
    this._scopeStack.push(new Scope(scopeId));
  }

  topScope() {
    return this._scopeStack.findScope(this._scopeStack.length - 1);
  }

  findScopeByIndex(index: number) {
    return this._scopeStack.findScope(index);
  }

  allScopes() {
    return this._scopeStack;
  }
}
