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

/** this.property this[property] 目前可以不理 */
interface ThisExpressionNode extends Node {
  type: 'ThisExpression';
}

/** const arr = [elements] */
interface ArrayExpressionNode extends Node {
  type: 'ArrayExpression';
  elements: ExpressionNode[] | null;
}

export function isArrayExpressionNode(node: Node): node is ArrayExpressionNode {
  return node.type === 'ArrayExpression';
}

interface ObjectExpressionNode extends Node {
  type: 'ObjectExpression';
  properties: PropertyNode[];
}

export function isObjectExpressionNode(node: Node): node is ObjectExpressionNode {
  return node.type === 'ObjectExpression';
}

interface FunctionExpressionNode extends FunctionNode {
  type: 'FunctionExpression';
}

export function isFunctionExpressionNode(node: Node): node is FunctionExpressionNode {
  return node.type === 'FunctionExpression';
}

interface UnaryExpressionNode extends Node {
  type: 'UnaryExpression';
  operator: UnaryOperator;
  prefix: boolean;
  argument: ExpressionNode;
}

const unaryOperator = ['-', '+', '!', '~', 'typeof', 'void', 'delete'] as const;

type UnaryOperator = typeof unaryOperator[number];

export function isUnaryExpressionNode(node: Node): node is UnaryExpressionNode {
  return node.type === 'UnaryExpression';
}

interface UpdateExpressionNode extends Node {
  type: 'UpdateExpression';
  operator: UpdateOperator;
  argument: ExpressionNode;
  prefix: boolean;
}

const updateOperator = ['++', '--'] as const;

type UpdateOperator = typeof updateOperator[number];

export function isUpdateExpressionNode(node: Node): node is UpdateExpressionNode {
  return node.type === 'UpdateExpression';
}

interface BinaryExpressionNode extends Node {
  type: 'BinaryExpression';
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
  return node.type === 'BinaryExpression';
}

interface AssignmentExpressionNode extends Node {
  type: 'AssignmentExpression';
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
  return node.type === 'AssignmentExpression';
}

interface LogicalExpressionNode extends Node {
  type: 'LogicalExpression';
  operator: LogicalOperator;
  left: ExpressionNode;
  right: ExpressionNode;
}

const logicalOperator = ['||', '&&', '??'] as const;

type LogicalOperator = typeof logicalOperator[number];

export function isLogicalExpressionNode(node: Node): node is LogicalExpressionNode {
  return node.type === 'LogicalExpression';
}

/** object[property] object.property */
interface MemberExpressionNode extends Node {
  type: 'MemberExpression';
  object: ExpressionNode;
  property: ExpressionNode;
  computed: boolean;
}

export function isMemberExpressionNode(node: Node): node is MemberExpressionNode {
  return node.type === 'MemberExpression';
}

interface ConditionalExpressionNode extends Node {
  type: 'ConditionalExpression';
  test: ExpressionNode;
  alternate: ExpressionNode;
  consequent: ExpressionNode;
}

export function isConditionalExpressionNode(node: Node): node is ConditionalExpressionNode {
  return node.type === 'ConditionalExpression';
}

interface CallExpressionNode extends Node {
  type: 'CallExpression';
  callee: ExpressionNode;
  arguments: ExpressionNode[];
}

export function isCallExpressionNode(node: Node): node is CallExpressionNode {
  return node.type === 'CallExpression';
}

interface NewExpressionNode extends Node {
  type: 'NewExpression';
  callee: ExpressionNode;
  arguments: ExpressionNode[];
}

export function isNewExpressionNode(node: Node): node is NewExpressionNode {
  return node.type === 'NewExpression';
}

interface SequenceExpressionNode extends Node {
  type: 'SequenceExpression';
  expressions: ExpressionNode[];
}

export function isSequenceExpressionNode(node: Node): node is SequenceExpressionNode {
  return node.type === 'SequenceExpression';
}

interface ArrowFunctionExpressionNode extends Omit<FunctionNode, 'body'> {
  type: 'ArrowFunctionExpression';
  body: FunctionBodyNode | ExpressionNode;
  expression: boolean;
}

export function isArrowFunctionExpressionNode(node: Node): node is ArrowFunctionExpressionNode {
  return node.type === 'ArrowFunctionExpression';
}

interface YieldExpressionNode extends Node {
  type: 'YieldExpression';
  argument: ExpressionNode | null;
  delegate: boolean;
}

export function isYieldExpressionNode(node: Node): node is YieldExpressionNode {
  return node.type === 'YieldExpression';
}

interface AwaitExpressionNode extends Node {
  type: 'AwaitExpression';
  argument: ExpressionNode;
}

export function isAwaitExpressionNode(node: Node): node is AwaitExpressionNode {
  return node.type === 'AwaitExpression';
}

interface ChainExpressionNode extends Node {
  type: 'ChainExpression';
  expression: ChainElementNode | MemberExpressionNode;
}

export function isChainExpressionNode(node: Node): node is ChainExpressionNode {
  return node.type === 'ChainExpression';
}

interface ChainElementNode extends MemberExpressionNode {
  optional: boolean;
}

interface ImportExpressionNode extends Node {
  type: 'ImportExpression';
  source: ExpressionNode;
}

export function isImportExpressionNode(node: Node): node is ImportExpressionNode {
  return node.type === 'ImportExpression';
}
