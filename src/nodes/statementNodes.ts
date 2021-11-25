import { Node } from 'acorn';
import { LiteralNode, IdentifierNode } from './sharedNodes';
import { ExpressionNode } from './expressionNodes';
import { PatternNode } from './patternNode';
import { DeclarationNode, VariableDeclarationNode } from './declarationNode';

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
  body: (StatementNode | DeclarationNode)[];
}

export function isBlockStatementNode(node: Node): node is BlockStatementNode {
  return node.type === StatementTypes.BlockStatementType;
}

/** static { } 目前acorn 不支持 */
interface StaticBlockNode extends Omit<BlockStatementNode, 'type'> {
  type: StatementTypes.StaticBlockType;
}

export interface FunctionBodyNode extends BlockStatementNode {
  body: (DirectiveNode | StatementNode)[];
}

/** 不需要管 */
interface EmptyStatementNode extends Node {
  type: StatementTypes.EmptyStatementType;
}

/** debugger; 不需要管 */
interface DebuggerStatementNode extends Node {
  type: StatementTypes.DebuggerStatementType;
}

/** 目前先不管 */
interface WithStatementNode extends Node {
  type: StatementTypes.WithStatementType;
  object: ExpressionNode;
  body: StatementNode;
}

interface ReturnStatementNode extends Node {
  type: StatementTypes.ReturnStatementType;
  argument: ExpressionNode | null;
}

export function isReturnStatementNode(node: Node): node is ReturnStatementNode {
  return node.type === StatementTypes.ReturnStatementType;
}

interface LabeledStatementNode extends Node {
  type: StatementTypes.LabeledStatementType;
  label: IdentifierNode;
  body: StatementNode;
}

export function isLabeledStatementNode(node: Node): node is LabeledStatementNode {
  return node.type === StatementTypes.LabeledStatementType;
}

interface BreakStatementNode extends Node {
  type: StatementTypes.BreakStatementType;
  label: IdentifierNode | null;
}

export function isBreakStatementNode(node: Node): node is BreakStatementNode {
  return node.type === StatementTypes.BreakStatementType;
}

interface ContinueStatementNode extends Node {
  type: StatementTypes.ContinueStatementType;
  label: IdentifierNode | null;
}

export function isContinueStatementNode(node: Node): node is ContinueStatementNode {
  return node.type === StatementTypes.ContinueStatementType;
}

interface IfStatementNode extends Node {
  type: StatementTypes.IfStatementType;
  test: ExpressionNode;
  consequent: StatementNode;
  alternate: StatementNode | null;
}

export function isIfStatementNode(node: Node): node is IfStatementNode {
  return node.type === StatementTypes.IfStatementType;
}

interface SwitchStatementNode extends Node {
  type: StatementTypes.SwitchStatementType;
  discriminant: ExpressionNode;
  cases: SwitchCaseNode[];
}

export function isSwitchStatementNode(node: Node): node is SwitchStatementNode {
  return node.type === StatementTypes.SwitchStatementType;
}

interface SwitchCaseNode extends Node {
  type: 'SwitchCase';
  test: ExpressionNode | null;
  consequent: StatementNode[];
}

interface ThrowStatementNode extends Node {
  type: StatementTypes.ThrowStatementType;
  argument: ExpressionNode;
}

export function isThrowStatementNode(node: Node): node is ThrowStatementNode {
  return node.type === StatementTypes.ThrowStatementType;
}

interface TryStatementNode extends Node {
  type: StatementTypes.TryStatementType;
  block: BlockStatementNode;
  handler: CatchClauseNode | null;
  finalizer: BlockStatementNode | null;
}

export function isTryStatementNode(node: Node): node is TryStatementNode {
  return node.type === StatementTypes.TryStatementType;
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

export function isWhileStatementNode(node: Node): node is WhileStatementNode {
  return node.type === StatementTypes.WhileStatementType;
}

interface DoWhileStatementNode extends Node {
  type: StatementTypes.DoWhileStatementType;
  body: StatementNode;
  test: ExpressionNode;
}

export function isDoWhileStatementNode(node: Node): node is DoWhileStatementNode {
  return node.type === StatementTypes.DoWhileStatementType;
}

interface ForStatementNode extends Node {
  type: StatementTypes.ForStatementType;
  init: VariableDeclarationNode | ExpressionNode | null;
  test: ExpressionNode | null;
  update: ExpressionNode | null;
  body: StatementNode;
}

export function isForStatementNode(node: Node): node is ForStatementNode {
  return node.type === StatementTypes.ForStatementType;
}

interface ForInStatementNode extends Node {
  type: StatementTypes.ForInStatementType;
  left: VariableDeclarationNode | PatternNode;
  right: ExpressionNode;
  body: StatementNode;
}

export function isForInStatementNode(node: Node): node is ForInStatementNode {
  return node.type === StatementTypes.ForInStatementType;
}

/** for await (const x of xs) { */
interface ForOfStatementNode extends Omit<ForInStatementNode, 'type'> {
  type: StatementTypes.ForOfStatementType;
  await: boolean;
}

export function isForOfStatementNode(node: Node): node is ForOfStatementNode {
  return node.type === StatementTypes.ForOfStatementType;
}
