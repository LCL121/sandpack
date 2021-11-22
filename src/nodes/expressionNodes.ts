import { Node } from 'acorn';
import { PatternNode } from './patternNode';
import { FunctionNode, IdentifierNode, LiteralNode, PrivateIdentifierNode, PropertyNode } from './sharedNodes';
import { FunctionBodyNode } from './statementNodes';

export type ExpressionNode =
  | ThisExpressionNode
  | ArrayExpressionNode
  | ObjectExpressionNode
  | FunctionExpressionNode
  | UnaryExpressionNode
  | UpdateExpressionNode
  | BinaryExpressionNode
  | AssignmentExpressionNode
  | LogicalExpressionNode
  | MemberExpressionNode
  | ConditionalExpressionNode
  | CallExpressionNode
  | NewExpressionNode
  | SequenceExpressionNode
  | ArrowFunctionExpressionNode
  | YieldExpressionNode
  | AwaitExpressionNode
  | ChainExpressionNode
  | ImportExpressionNode
  | IdentifierNode
  | LiteralNode
  | PrivateIdentifierNode;

enum ExpressionTypes {
  ThisExpressionType = 'ThisExpression',
  ArrayExpressionType = 'ArrayExpression',
  ObjectExpressionType = 'ObjectExpression',
  FunctionExpressionType = 'FunctionExpression',
  UnaryExpressionType = 'UnaryExpression',
  UpdateExpressionType = 'UpdateExpression',
  BinaryExpressionType = 'BinaryExpression',
  AssignmentExpressionType = 'AssignmentExpression',
  LogicalExpressionType = 'LogicalExpression',
  MemberExpressionType = 'MemberExpression',
  ConditionalExpressionType = 'ConditionalExpression',
  CallExpressionType = 'CallExpression',
  NewExpressionType = 'NewExpression',
  SequenceExpressionType = 'SequenceExpression',
  ArrowFunctionExpressionType = 'ArrowFunctionExpression',
  YieldExpressionType = 'YieldExpression',
  AwaitExpressionType = 'AwaitExpression',
  ChainExpressionType = 'ChainExpression',
  ImportExpressionType = 'ImportExpression'
}

/** this.property this[property] 目前可以不理 */
interface ThisExpressionNode extends Node {
  type: ExpressionTypes.ThisExpressionType;
}

/** const arr = [elements] */
interface ArrayExpressionNode extends Node {
  type: ExpressionTypes.ArrayExpressionType;
  elements: ExpressionNode[] | null;
}

export function isArrayExpressionNode(node: Node): node is ArrayExpressionNode {
  return node.type === ExpressionTypes.ArrayExpressionType;
}

interface ObjectExpressionNode extends Node {
  type: ExpressionTypes.ObjectExpressionType;
  properties: PropertyNode[];
}

export function isObjectExpressionNode(node: Node): node is ObjectExpressionNode {
  return node.type === ExpressionTypes.ObjectExpressionType;
}

export interface FunctionExpressionNode extends FunctionNode {
  type: ExpressionTypes.FunctionExpressionType;
}

export function isFunctionExpressionNode(node: Node): node is FunctionExpressionNode {
  return node.type === ExpressionTypes.FunctionExpressionType;
}

interface UnaryExpressionNode extends Node {
  type: ExpressionTypes.UnaryExpressionType;
  operator: UnaryOperator;
  prefix: boolean;
  argument: ExpressionNode;
}

const unaryOperator = ['-', '+', '!', '~', 'typeof', 'void', 'delete'] as const;

type UnaryOperator = typeof unaryOperator[number];

export function isUnaryExpressionNode(node: Node): node is UnaryExpressionNode {
  return node.type === ExpressionTypes.UnaryExpressionType;
}

interface UpdateExpressionNode extends Node {
  type: ExpressionTypes.UpdateExpressionType;
  operator: UpdateOperator;
  argument: ExpressionNode;
  prefix: boolean;
}

const updateOperator = ['++', '--'] as const;

type UpdateOperator = typeof updateOperator[number];

export function isUpdateExpressionNode(node: Node): node is UpdateExpressionNode {
  return node.type === ExpressionTypes.UpdateExpressionType;
}

interface BinaryExpressionNode extends Node {
  type: ExpressionTypes.BinaryExpressionType;
  operator: BinaryOperator;
  left: ExpressionNode | PrivateIdentifierNode;
  right: ExpressionNode;
}

const binaryOperator = [
  '==',
  '!=',
  '===',
  '!==',
  '<',
  '<=',
  '>',
  '>=',
  '<<',
  '>>',
  '>>>',
  '+',
  '-',
  '*',
  '/',
  '%',
  ',',
  '^',
  '&',
  'in',
  'instanceof',
  '**'
] as const;

type BinaryOperator = typeof binaryOperator[number];

export function isBinaryExpressionNode(node: Node): node is BinaryExpressionNode {
  return node.type === ExpressionTypes.BinaryExpressionType;
}

interface AssignmentExpressionNode extends Node {
  type: ExpressionTypes.AssignmentExpressionType;
  operator: AssignmentOperator;
  // left: PatternNode | ExpressionNode; left 为PatternNode 目前没找到例子
  left: ExpressionNode;
  right: ExpressionNode;
}

const assignmentOperator = [
  '=',
  '+=',
  '-=',
  '*=',
  '/=',
  '%=',
  '<<=',
  '>>=',
  '>>>=',
  ',=',
  '^=',
  '&=',
  '**=',
  '??='
] as const;

type AssignmentOperator = typeof assignmentOperator[number];

export function isAssignmentExpressionNode(node: Node): node is AssignmentExpressionNode {
  return node.type === ExpressionTypes.AssignmentExpressionType;
}

interface LogicalExpressionNode extends Node {
  type: ExpressionTypes.LogicalExpressionType;
  operator: LogicalOperator;
  left: ExpressionNode;
  right: ExpressionNode;
}

const logicalOperator = ['||', '&&', '??'] as const;

type LogicalOperator = typeof logicalOperator[number];

export function isLogicalExpressionNode(node: Node): node is LogicalExpressionNode {
  return node.type === ExpressionTypes.LogicalExpressionType;
}

/** object[property] object.property */
interface MemberExpressionNode extends Node {
  type: ExpressionTypes.MemberExpressionType;
  object: ExpressionNode;
  property: ExpressionNode;
  computed: boolean;
}

export function isMemberExpressionNode(node: Node): node is MemberExpressionNode {
  return node.type === ExpressionTypes.MemberExpressionType;
}

interface ConditionalExpressionNode extends Node {
  type: ExpressionTypes.ConditionalExpressionType;
  test: ExpressionNode;
  alternate: ExpressionNode;
  consequent: ExpressionNode;
}

export function isConditionalExpressionNode(node: Node): node is ConditionalExpressionNode {
  return node.type === ExpressionTypes.ConditionalExpressionType;
}

interface CallExpressionNode extends Node {
  type: ExpressionTypes.CallExpressionType;
  callee: ExpressionNode;
  arguments: ExpressionNode[];
}

export function isCallExpressionNode(node: Node): node is CallExpressionNode {
  return node.type === ExpressionTypes.CallExpressionType;
}

interface NewExpressionNode extends Node {
  type: ExpressionTypes.NewExpressionType;
  callee: ExpressionNode;
  arguments: ExpressionNode[];
}

export function isNewExpressionNode(node: Node): node is NewExpressionNode {
  return node.type === ExpressionTypes.NewExpressionType;
}

interface SequenceExpressionNode extends Node {
  type: ExpressionTypes.SequenceExpressionType;
  expressions: ExpressionNode[];
}

export function isSequenceExpressionNode(node: Node): node is SequenceExpressionNode {
  return node.type === ExpressionTypes.SequenceExpressionType;
}

interface ArrowFunctionExpressionNode extends Omit<FunctionNode, 'body'> {
  type: ExpressionTypes.ArrowFunctionExpressionType;
  body: FunctionBodyNode | ExpressionNode;
  expression: boolean;
}

export function isArrowFunctionExpressionNode(node: Node): node is ArrowFunctionExpressionNode {
  return node.type === ExpressionTypes.ArrowFunctionExpressionType;
}

interface YieldExpressionNode extends Node {
  type: ExpressionTypes.YieldExpressionType;
  argument: ExpressionNode | null;
  delegate: boolean;
}

export function isYieldExpressionNode(node: Node): node is YieldExpressionNode {
  return node.type === ExpressionTypes.YieldExpressionType;
}

interface AwaitExpressionNode extends Node {
  type: ExpressionTypes.AwaitExpressionType;
  argument: ExpressionNode;
}

export function isAwaitExpressionNode(node: Node): node is AwaitExpressionNode {
  return node.type === ExpressionTypes.AwaitExpressionType;
}

interface ChainExpressionNode extends Node {
  type: ExpressionTypes.ChainExpressionType;
  expression: ChainElementNode | MemberExpressionNode;
}

export function isChainExpressionNode(node: Node): node is ChainExpressionNode {
  return node.type === ExpressionTypes.ChainExpressionType;
}

interface ChainElementNode extends MemberExpressionNode {
  optional: boolean;
}

interface ImportExpressionNode extends Node {
  type: ExpressionTypes.ImportExpressionType;
  source: ExpressionNode;
}

export function isImportExpressionNode(node: Node): node is ImportExpressionNode {
  return node.type === ExpressionTypes.ImportExpressionType;
}
