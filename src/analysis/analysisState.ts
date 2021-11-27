import { Node } from 'acorn';
import { ScopedId } from './constant';
import { Scope, ScopeStack } from './scope';

export class AnalysisState {
  private _idCount = 0;
  private _scopeStack = new ScopeStack();
  private readonly _fileId: string;
  private readonly _code: string;

  constructor(code: string, fileId: string) {
    this._fileId = fileId;
    this._code = code;
  }

  uniqueIdGenerator() {
    return `sand$${this._fileId}$${this._idCount++}`;
  }

  pushScope(scopeId: ScopedId) {
    this._scopeStack.push(new Scope(scopeId));
  }

  popScope() {
    return this._scopeStack.pop();
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

  findVar(key: string) {
    return this._scopeStack.findVar(key);
  }

  getCode(start: number, end: number) {
    return this._code.slice(start, end);
  }

  getCodeByNode(node: Node) {
    return this.getCode(node.start, node.end);
  }
}
