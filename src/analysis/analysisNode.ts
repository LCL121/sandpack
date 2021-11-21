import { Node } from 'acorn';
import { isClassDeclarationNode, isVariableDeclarationNode, isFunctionDeclarationNode } from '../nodes/declarationNode';
import {
  ExpressionNode,
  isArrayExpressionNode,
  isArrowFunctionExpressionNode,
  isAssignmentExpressionNode,
  isAwaitExpressionNode,
  isBinaryExpressionNode,
  isCallExpressionNode,
  isChainExpressionNode,
  isConditionalExpressionNode,
  isFunctionExpressionNode,
  isImportExpressionNode,
  isLogicalExpressionNode,
  isMemberExpressionNode,
  isNewExpressionNode,
  isObjectExpressionNode,
  isSequenceExpressionNode,
  isUnaryExpressionNode,
  isUpdateExpressionNode,
  isYieldExpressionNode
} from '../nodes/expressionNodes';
import { isIdentifierNode, isLiteralNode } from '../nodes/sharedNodes';
import { ExpressionStatementNode, isExpressionStatementNode } from '../nodes/statementNodes';
import { AnalysisResult } from './analysisResult';
import { AnalysisState } from './analysisState';
import { analysisPattern } from './utils';

export function analysisNode(node: Node, result: AnalysisResult, state: AnalysisState): AnalysisIdentifierNodeObj {
  const resultDeclarationObj: AnalysisIdentifierNodeObj = {};

  // declaration analysis
  if (isVariableDeclarationNode(node)) {
    for (const declaration of node.declarations) {
      const dependencies = analysisExpressionNode(declaration.init);
      for (const { local } of analysisPattern(declaration.id)) {
        resultDeclarationObj[local] = {
          code: '',
          dependencies,
          id: state.uniqueIdGenerator(),
          used: false
        };
      }
    }
  } else if (isFunctionDeclarationNode(node)) {
    const local = node.id.name;
    // TODO
  } else if (isClassDeclarationNode(node)) {
    // TODO
  }

  // statement analysis
  if (isExpressionStatementNode(node)) {
    result.addStatements(analysisExpressionStatementNode(node, state))
  }

  return resultDeclarationObj;
}

function analysisExpressionStatementNode(node: ExpressionStatementNode, state: AnalysisState): AnalysisNodeResult {
  const result: AnalysisNodeResult = Object.create(null);
  result.code = '';
  result.dependencies = analysisExpressionNode(node.expression);
  result.id = state.uniqueIdGenerator();
  result.used = false;
  return result;
}

function analysisExpressionNode(node: ExpressionNode) {
  const results: string[] = [];
  if (isLiteralNode(node)) {
    // 无依赖不需要保存
    return results;
  } else if (isIdentifierNode(node)) {
    return [node.name];
  } else if (isArrayExpressionNode(node)) {
    if (node.elements) {
      for (const element of node.elements) {
        results.push(...analysisExpressionNode(element));
      }
    }
  } else if (isObjectExpressionNode(node)) {
    for (const property of node.properties) {
      results.push(...analysisExpressionNode(property.value));
    }
  } else if (isFunctionExpressionNode(node)) {
    // TODO
  } else if (isUnaryExpressionNode(node) || isUpdateExpressionNode(node) || isAwaitExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.argument));
  } else if (isBinaryExpressionNode(node) || isLogicalExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.left));
    results.push(...analysisExpressionNode(node.right));
  } else if (isAssignmentExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.right));
  } else if (isMemberExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.object));
  } else if (isConditionalExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.test));
    results.push(...analysisExpressionNode(node.consequent));
    results.push(...analysisExpressionNode(node.alternate));
  } else if (isCallExpressionNode(node) || isNewExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.callee));
    for (const argument of node.arguments) {
      results.push(...analysisExpressionNode(argument));
    }
  } else if (isSequenceExpressionNode(node)) {
    for (const expression of node.expressions) {
      results.push(...analysisExpressionNode(expression));
    }
  } else if (isArrowFunctionExpressionNode(node)) {
    // TODO
  } else if (isYieldExpressionNode(node)) {
    if (node.argument) {
      results.push(...analysisExpressionNode(node.argument));
    }
  } else if (isChainExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.expression));
  } else if (isImportExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.source));
  }

  return results;
}

/** 以name 为key */
export interface AnalysisIdentifierNodeObj {
  [key: string]: AnalysisNodeResult;
}

/**
 * 结构设计思路
 * statements 保存statement 对应的数据
 * 以dependency 为key：
 *    1：dependency: string
 *    2：dependency: Dependency
 *        => 当某个statement、declaration 有该object 的属性，需要将其完整导出去
 *        => 以Dependency.value 为key
 */
export interface AnalysisStatementNodeObj {
  statements: AnalysisNodeResult[];
  [key: string]: number[] | AnalysisNodeResult[];
}

export interface AnalysisNodeResult {
  code: string;
  dependencies: string[] | Dependency[];
  id: string;
  used: boolean;
}

export interface Dependency {
  value: string;
  attributes: string[];
}
