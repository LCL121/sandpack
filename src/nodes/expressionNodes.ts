import { Node } from 'acorn';
import { PatternNode } from './patternNode';
import { FunctionNode, IdentifierNode, PrivateIdentifierNode, PropertyNode } from './sharedNodes';
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
  | IdentifierNode;

interface ThisExpressionNode extends Node {
  type: 'ThisExpression';
}

interface ArrayExpressionNode extends Node {
  type: 'ArrayExpression';
  elements: ExpressionNode[] | null;
}

interface ObjectExpressionNode extends Node {
  type: 'ObjectExpression';
  properties: PropertyNode[];
}

interface FunctionExpressionNode extends FunctionNode {
  type: 'FunctionExpression';
}

interface UnaryExpressionNode extends Node {
  type: 'UnaryExpression';
  operator: UnaryOperator;
  prefix: boolean;
  argument: ExpressionNode;
}

const unaryOperator = ['-', '+', '!', '~', 'typeof', 'void', 'delete'] as const;

type UnaryOperator = typeof unaryOperator[number];

interface UpdateExpressionNode extends Node {
  type: 'UpdateExpression';
  operator: UpdateOperator;
  argument: ExpressionNode;
  prefix: boolean;
}

const updateOperator = ['++', '--'] as const;

type UpdateOperator = typeof updateOperator[number];

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

interface AssignmentExpressionNode extends Node {
  type: 'AssignmentExpression';
  operator: AssignmentOperator;
  left: PatternNode | ExpressionNode;
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

interface LogicalExpressionNode extends Node {
  type: 'LogicalExpression';
  operator: LogicalOperator;
  left: ExpressionNode;
  right: ExpressionNode;
}

const logicalOperator = ['||', '&&', '??'] as const;

type LogicalOperator = typeof logicalOperator[number];

/** object[property] object.property */
interface MemberExpressionNode extends Node {
  type: 'MemberExpression';
  object: ExpressionNode;
  property: ExpressionNode;
  computed: boolean;
}

interface ConditionalExpressionNode extends Node {
  type: 'ConditionalExpression';
  test: ExpressionNode;
  alternate: ExpressionNode;
  consequent: ExpressionNode;
}

interface CallExpressionNode extends Node {
  type: 'CallExpression';
  callee: ExpressionNode;
  arguments: ExpressionNode[];
}

interface NewExpressionNode extends Node {
  type: 'NewExpression';
  callee: ExpressionNode;
  arguments: ExpressionNode[];
}

interface SequenceExpressionNode extends Node {
  type: 'SequenceExpression';
  expressions: ExpressionNode[];
}

interface ArrowFunctionExpressionNode extends Omit<FunctionNode, 'body'> {
  type: 'ArrowFunctionExpression';
  body: FunctionBodyNode | ExpressionNode;
  expression: boolean;
}

interface YieldExpressionNode extends Node {
  type: 'YieldExpression';
  argument: ExpressionNode | null;
  delegate: boolean;
}

interface AwaitExpressionNode extends Node {
  type: 'AwaitExpression';
  argument: ExpressionNode;
}

interface ChainExpressionNode extends Node {
  type: 'ChainExpression';
  expression: ChainElementNode | MemberExpressionNode;
}

interface ChainElementNode extends MemberExpressionNode {
  optional: boolean;
}

interface ImportExpression extends Node {
  type: 'ImportExpression';
  source: ExpressionNode;
}
