import { Node } from 'acorn';
import { LiteralNode, IdentifierNode } from './sharedNodes';
import { ExpressionNode } from './expressionNodes';
import { PatternNode } from './patternNode';
import { VariableDeclarationNode } from './declarationNode';

export type StatementNode =
  | ExpressionStatementNode
  | DirectiveNode
  | BlockStatementNode
  | EmptyStatementNode
  | DebuggerStatementNode
  | WithStatementNode
  | LabeledStatementNode
  | ReturnStatementNode
  | BreakStatementNode
  | ContinueStatementNode
  | IfStatementNode
  | SwitchStatementNode
  | ThrowStatementNode
  | TryStatementNode
  | WhileStatementNode
  | DoWhileStatementNode
  | ForStatementNode
  | ForInStatementNode
  | ForOfStatementNode;

export interface ExpressionStatementNode extends Node {
  type: 'ExpressionStatement';
  expression: ExpressionNode;
}

export function isExpressionStatementNode(node: Node): node is ExpressionStatementNode {
  return node.type === 'ExpressionStatement';
}

/** 目前找不到对应的例子 */
interface DirectiveNode extends Node {
  type: 'ExpressionStatement';
  expression: LiteralNode;
  directive: string;
}

export interface BlockStatementNode extends Node {
  type: 'BlockStatement';
  body: StatementNode[];
}

/** static { } */
interface StaticBlockNode extends Omit<BlockStatementNode, 'type'> {
  type: "StaticBlock"
}


export interface FunctionBodyNode extends BlockStatementNode {
  body: [DirectiveNode | StatementNode];
}

interface EmptyStatementNode extends Node {
  type: 'EmptyStatement';
}

interface DebuggerStatementNode extends Node {
  type: 'DebuggerStatement';
}

interface WithStatementNode extends Node {
  type: 'WithStatement';
  object: ExpressionNode;
  body: StatementNode;
}

interface ReturnStatementNode extends Node {
  type: 'ReturnStatement';
  argument: ExpressionNode | null;
}

interface LabeledStatementNode extends Node {
  type: 'LabeledStatement';
  label: IdentifierNode;
  body: StatementNode;
}

interface BreakStatementNode extends Node {
  type: 'BreakStatement';
  label: IdentifierNode | null;
}

interface ContinueStatementNode extends Node {
  type: 'ContinueStatement';
  label: IdentifierNode | null;
}

interface IfStatementNode extends Node {
  type: 'IfStatement';
  test: ExpressionNode;
  consequent: StatementNode;
  alternate: StatementNode | null;
}

interface SwitchStatementNode extends Node {
  type: 'SwitchStatement';
  discriminant: ExpressionNode;
  cases: [SwitchCaseNode];
}

interface SwitchCaseNode extends Node {
  type: 'SwitchCase';
  test: ExpressionNode | null;
  consequent: [StatementNode];
}

interface ThrowStatementNode extends Node {
  type: 'ThrowStatement';
  argument: ExpressionNode;
}

interface TryStatementNode extends Node {
  type: 'TryStatement';
  block: BlockStatementNode;
  handler: CatchClauseNode | null;
  finalizer: BlockStatementNode | null;
}

interface CatchClauseNode extends Node {
  type: 'CatchClause';
  param: PatternNode | null;
  body: BlockStatementNode;
}

interface WhileStatementNode extends Node {
  type: 'WhileStatement';
  test: ExpressionNode;
  body: StatementNode;
}

interface DoWhileStatementNode extends Node {
  type: 'DoWhileStatement';
  body: StatementNode;
  test: ExpressionNode;
}

interface ForStatementNode extends Node {
  type: 'ForStatement';
  init: VariableDeclarationNode | ExpressionNode | null;
  test: ExpressionNode | null;
  update: ExpressionNode | null;
  body: StatementNode;
}

interface ForInStatementNode extends Node {
  type: 'ForInStatement';
  left: VariableDeclarationNode | PatternNode;
  right: ExpressionNode;
  body: StatementNode;
}

/** for await (const x of xs) { */
interface ForOfStatementNode extends Omit<ForInStatementNode, 'type'> {
  type: 'ForOfStatement';
  await: boolean;
}
