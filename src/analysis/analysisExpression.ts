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
import { isAssignmentPatternNode } from '../nodes/patternNode';
import { isIdentifierNode, isLiteralNode } from '../nodes/sharedNodes';
import { analysisNode } from './analysisNode';
import { analysisPattern } from './analysisPattern';
import { AnalysisResult } from './analysisResult';
import { AnalysisState } from './analysisState';
import { ScopedId } from './constant';

export function analysisExpressionNode(node: ExpressionNode, result: AnalysisResult, state: AnalysisState) {
  const results: string[] = [];
  if (isLiteralNode(node)) {
    // 无依赖不需要保存
    return results;
  } else if (isIdentifierNode(node)) {
    return [node.name];
  } else if (isArrayExpressionNode(node)) {
    if (node.elements) {
      for (const element of node.elements) {
        results.push(...analysisExpressionNode(element, result, state));
      }
    }
  } else if (isObjectExpressionNode(node)) {
    for (const property of node.properties) {
      results.push(...analysisExpressionNode(property.value, result, state));
    }
  } else if (isFunctionExpressionNode(node) || isArrowFunctionExpressionNode(node)) {
    // 此作用域用于压入params，按es 标准有个隐藏的作用域
    state.pushScope(ScopedId.blockScoped);
    const needDependencies: string[] = [];
    // 解析params
    for (const param of node.params) {
      for (const { exported } of analysisPattern(param)) {
        state.topScope().push(exported);
      }
      if (isAssignmentPatternNode(param)) {
        for (const dependency of analysisExpressionNode(param.right, result, state)) {
          if (state.findVar(dependency) === null) {
            needDependencies.push(dependency);
          }
        }
      }
    }
    // 解析body
    const { dependencies } = analysisNode(node.body, result, state);
    results.push(...dependencies, ...needDependencies);
    state.popScope();
  } else if (isUnaryExpressionNode(node) || isUpdateExpressionNode(node) || isAwaitExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.argument, result, state));
  } else if (isBinaryExpressionNode(node) || isLogicalExpressionNode(node) || isAssignmentExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.left, result, state));
    results.push(...analysisExpressionNode(node.right, result, state));
  } else if (isMemberExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.object, result, state));
  } else if (isConditionalExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.test, result, state));
    results.push(...analysisExpressionNode(node.consequent, result, state));
    results.push(...analysisExpressionNode(node.alternate, result, state));
  } else if (isCallExpressionNode(node) || isNewExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.callee, result, state));
    for (const argument of node.arguments) {
      results.push(...analysisExpressionNode(argument, result, state));
    }
  } else if (isSequenceExpressionNode(node)) {
    for (const expression of node.expressions) {
      results.push(...analysisExpressionNode(expression, result, state));
    }
  } else if (isYieldExpressionNode(node)) {
    if (node.argument) {
      results.push(...analysisExpressionNode(node.argument, result, state));
    }
  } else if (isChainExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.expression, result, state));
  } else if (isImportExpressionNode(node)) {
    results.push(...analysisExpressionNode(node.source, result, state));
  }

  return results;
}
