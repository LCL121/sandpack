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

export function analysisExpressionNode(node: ExpressionNode) {
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
  } else if (isBinaryExpressionNode(node) || isLogicalExpressionNode(node) || isAssignmentExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.left));
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
