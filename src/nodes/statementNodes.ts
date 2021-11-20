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
  | ForOfStatementNode
  | StaticBlockNode;

enum StatementTypes {
  ExpressionStatementType = 'ExpressionStatement',
  BlockStatementType = 'BlockStatement',
  StaticBlockType = 'StaticBlock',
  EmptyStatementType = 'EmptyStatement',
  DebuggerStatementType = 'DebuggerStatement',
  WithStatementType = 'WithStatement',
  ReturnStatementType = 'ReturnStatement',
  LabeledStatementType = 'LabeledStatement',
  BreakStatementType = 'BreakStatement',
  ContinueStatementType = 'ContinueStatement',
  IfStatementType = 'IfStatement',
  SwitchStatementType = 'SwitchStatement',
  ThrowStatementType = 'ThrowStatement',
  TryStatementType = 'TryStatement',
  WhileStatementType = 'WhileStatement',
  DoWhileStatementType = 'DoWhileStatement',
  ForStatementType = 'ForStatement',
  ForInStatementType = 'ForInStatement',
  ForOfStatementType = 'ForOfStatement'
}

export interface ExpressionStatementNode extends Node {
  type: StatementTypes.ExpressionStatementType;
  expression: ExpressionNode;
}

export function isExpressionStatementNode(node: Node): node is ExpressionStatementNode {
  return node.type === StatementTypes.ExpressionStatementType;
}

/** 目前找不到对应的例子 */
interface DirectiveNode extends Node {
  type: StatementTypes.ExpressionStatementType;
  expression: LiteralNode;
  directive: string;
}

export interface BlockStatementNode extends Node {
  type: StatementTypes.BlockStatementType;
  body: StatementNode[];
}

/** static { } */
interface StaticBlockNode extends Omit<BlockStatementNode, 'type'> {
  type: StatementTypes.StaticBlockType;
}

export interface FunctionBodyNode extends BlockStatementNode {
  body: [DirectiveNode | StatementNode];
}

interface EmptyStatementNode extends Node {
  type: StatementTypes.EmptyStatementType;
}

interface DebuggerStatementNode extends Node {
  type: StatementTypes.DebuggerStatementType;
}

interface WithStatementNode extends Node {
  type: StatementTypes.WithStatementType;
  object: ExpressionNode;
  body: StatementNode;
}

interface ReturnStatementNode extends Node {
  type: StatementTypes.ReturnStatementType;
  argument: ExpressionNode | null;
}

interface LabeledStatementNode extends Node {
  type: StatementTypes.LabeledStatementType;
  label: IdentifierNode;
  body: StatementNode;
}

interface BreakStatementNode extends Node {
  type: StatementTypes.BreakStatementType;
  label: IdentifierNode | null;
}

interface ContinueStatementNode extends Node {
  type: StatementTypes.ContinueStatementType;
  label: IdentifierNode | null;
}

interface IfStatementNode extends Node {
  type: StatementTypes.IfStatementType;
  test: ExpressionNode;
  consequent: StatementNode;
  alternate: StatementNode | null;
}

interface SwitchStatementNode extends Node {
  type: StatementTypes.SwitchStatementType;
  discriminant: ExpressionNode;
  cases: [SwitchCaseNode];
}

interface SwitchCaseNode extends Node {
  type: 'SwitchCase';
  test: ExpressionNode | null;
  consequent: [StatementNode];
}

interface ThrowStatementNode extends Node {
  type: StatementTypes.ThrowStatementType;
  argument: ExpressionNode;
}

interface TryStatementNode extends Node {
  type: StatementTypes.TryStatementType;
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
  type: StatementTypes.WhileStatementType;
  test: ExpressionNode;
  body: StatementNode;
}

interface DoWhileStatementNode extends Node {
  type: StatementTypes.DoWhileStatementType;
  body: StatementNode;
  test: ExpressionNode;
}

interface ForStatementNode extends Node {
  type: StatementTypes.ForStatementType;
  init: VariableDeclarationNode | ExpressionNode | null;
  test: ExpressionNode | null;
  update: ExpressionNode | null;
  body: StatementNode;
}

interface ForInStatementNode extends Node {
  type: StatementTypes.ForInStatementType;
  left: VariableDeclarationNode | PatternNode;
  right: ExpressionNode;
  body: StatementNode;
}

/** for await (const x of xs) { */
interface ForOfStatementNode extends Omit<ForInStatementNode, 'type'> {
  type: StatementTypes.ForOfStatementType;
  await: boolean;
}
