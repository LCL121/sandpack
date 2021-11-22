import { Node } from 'acorn';
import {
  isClassDeclarationNode,
  isVariableDeclarationNode,
  isFunctionDeclarationNode,
  isPropertyDefinitionNode,
  isMethodDefinitionNode
} from '../nodes/declarationNode';
import {
  ExpressionStatementNode,
  isBlockStatementNode,
  isExpressionStatementNode,
  isReturnStatementNode
} from '../nodes/statementNodes';
import { isEmptyObject } from '../utils/object';
import { isString } from '../utils/type';
import { AnalysisResult } from './analysisResult';
import { AnalysisState } from './analysisState';
import { ScopedId } from './constant';
import { analysisPattern } from './analysisPattern';
import { analysisExpressionNode } from './analysisExpression';
import { isAssignmentPatternNode } from '../nodes/patternNode';

interface IAnalysisNodeResult {
  locals: string[];
  dependencies: string[];
}

export function analysisNode(node: Node, result: AnalysisResult, state: AnalysisState): IAnalysisNodeResult {
  const resultObj: IAnalysisNodeResult = {
    locals: [],
    dependencies: []
  };
  const resultDeclarationObj: AnalysisIdentifierNodeObj = Object.create(null);

  // declaration analysis
  if (isVariableDeclarationNode(node)) {
    for (const declaration of node.declarations) {
      const dependencies = analysisExpressionNode(declaration.init, result, state);
      resultObj.dependencies.push(...dependencies);
      for (const { local } of analysisPattern(declaration.id)) {
        resultObj.locals.push(local);
        state.topScope().push(local);
        resultDeclarationObj[local] = {
          code: '',
          dependencies,
          id: state.uniqueIdGenerator(),
          used: false
        };
      }
    }
  } else if (isFunctionDeclarationNode(node)) {
    // 此作用域用于压入params，按es 标准有个隐藏的作用域
    state.pushScope(ScopedId.blockScoped);
    const localName = node.id.name;
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
    resultDeclarationObj[localName] = createAnalysisNodeResult('', state.uniqueIdGenerator(), dependencies);
    resultObj.dependencies.push(...dependencies, ...needDependencies);
    state.popScope();
  } else if (isClassDeclarationNode(node)) {
    const keyName = node.id.name;
    const dependencies: string[] = [];
    if (node.superClass) {
      dependencies.push(...analysisExpressionNode(node.superClass, result, state));
    }
    for (const property of node.body.body) {
      if (isPropertyDefinitionNode(property)) {
        if (property.value) {
          dependencies.push(...analysisExpressionNode(property.value, result, state));
        }
      } else if (isMethodDefinitionNode(property)) {
        dependencies.push(...analysisExpressionNode(property.value, result, state));
      }
    }
    resultDeclarationObj[keyName] = createAnalysisNodeResult('', state.uniqueIdGenerator(), dependencies);
    resultObj.dependencies.push(...dependencies);
  }

  // 只有top level 才压入结果
  if (!isEmptyObject(resultDeclarationObj) && state.topScope().isTopLevelScope()) {
    result.addIdentifiers(false, resultDeclarationObj);
  }

  // statement analysis
  if (isExpressionStatementNode(node)) {
    const statementResult = analysisExpressionStatementNode('', state.uniqueIdGenerator(), node, result, state);
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    for (const dependency of statementResult.dependencies) {
      if (isString(dependency)) {
        resultObj.dependencies.push(dependency);
      } else {
        resultObj.dependencies.push(dependency.value);
      }
    }
  } else if (isBlockStatementNode(node)) {
    const needDependencies: string[] = [];
    state.pushScope(ScopedId.blockScoped);
    for (const statement of node.body) {
      const { dependencies } = analysisNode(statement, result, state);
      for (const dependency of dependencies) {
        if (state.findVar(dependency) === null) {
          needDependencies.push(dependency);
        }
      }
    }
    // 因为需要判断是否为top level scope，因此需要提前出栈
    state.popScope();
    const statementResult: AnalysisNodeResult = {
      code: '',
      id: state.uniqueIdGenerator(),
      dependencies: needDependencies,
      used: false
    };
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    resultObj.dependencies.push(...needDependencies);
  } else if (isReturnStatementNode(node)) {
    if (node.argument) {
      resultObj.dependencies.push(...analysisExpressionNode(node.argument, result, state));
    }
  }

  return resultObj;
}

function analysisExpressionStatementNode(
  code: string,
  id: string,
  node: ExpressionStatementNode,
  result: AnalysisResult,
  state: AnalysisState
): AnalysisNodeResult {
  return createAnalysisNodeResult(code, id, analysisExpressionNode(node.expression, result, state));
}

/** 以name 为key */
export interface AnalysisIdentifierNodeObj {
  [key: string]: AnalysisNodeResult;
}

function createAnalysisNodeResult(code: string, id: string, dependencies: (string | Dependency)[]) {
  const result: AnalysisNodeResult = Object.create(null);
  result.code = code;
  result.id = id;
  result.dependencies = dependencies;
  result.used = false;
  return result;
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
  dependencies: (string | Dependency)[];
  id: string;
  used: boolean;
}

export interface Dependency {
  value: string;
  attributes: string[];
}
