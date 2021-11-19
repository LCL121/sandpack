export class Scope {
  var = [];
  lexical = [];
  functions = [];
}

export class ScopeStack {
  private _scopes: Scope[] = [];

  push(scope: Scope): void {
    this._scopes.push(scope);
  }

  pop(): Scope | undefined {
    return this._scopes.pop();
  }
}
