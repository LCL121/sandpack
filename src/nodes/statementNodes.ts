import { Node } from 'acorn';
import { LiteralNode, IdentifierNode } from './sharedNodes';
import { ExpressionNode } from './expressionNodes';

export interface StatementNode extends Node {}

export interface ExpressionStatementNode extends StatementNode {
  type: 'ExpressionStatement';
  expression: ExpressionNode;
}

interface DirectiveNode extends Node {
  type: 'ExpressionStatement';
  expression: LiteralNode;
  directive: string;
}

export interface FunctionBodyNode extends BlockStatementNode {
  body: [DirectiveNode | StatementNode];
}

export interface BlockStatementNode extends Node {
  type: 'BlockStatement';
  body: StatementNode[];
}

interface EmptyStatementNode extends StatementNode {
  type: 'EmptyStatement';
}

interface WithStatementNode extends StatementNode {
  type: "WithStatement";
  object: ExpressionNode;
  body: StatementNode;
}


interface ReturnStatementNode extends StatementNode {
  type: "ReturnStatement";
  argument: ExpressionNode | null;
}

interface LabeledStatementNode extends StatementNode {
  type: "LabeledStatement";
  label: IdentifierNode;
  body: StatementNode;
}


