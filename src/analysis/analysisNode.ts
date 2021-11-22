import { Node } from 'acorn';
import { isClassDeclarationNode, isVariableDeclarationNode, isFunctionDeclarationNode } from '../nodes/declarationNode';
import { ExpressionStatementNode, isBlockStatementNode, isExpressionStatementNode } from '../nodes/statementNodes';
import { isEmptyObject } from '../utils/object';
import { isString } from '../utils/type';
import { AnalysisResult } from './analysisResult';
import { AnalysisState } from './analysisState';
import { ScopedId } from './constant';
import { analysisPattern } from './analysisPattern';
import { analysisExpressionNode } from './analysisExpression';

interface IAnalysisNodeResult {
  locals: string[];
  dependencies: string[];
}

export function analysisNode(node: Node, result: AnalysisResult, state: AnalysisState): IAnalysisNodeResult {
  const resultObj: IAnalysisNodeResult = {
    locals: [],
    dependencies: []
  }
  const resultDeclarationObj: AnalysisIdentifierNodeObj = Object.create(null);

  // declaration analysis
  if (isVariableDeclarationNode(node)) {
    for (const declaration of node.declarations) {
      const dependencies = analysisExpressionNode(declaration.init);
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
    const local = node.id.name;
    // 解析params
    for (const param of node.params) {
      for (const { exported, local } of analysisPattern(param)) {
        console.log(exported, local)
      }
    }
    // 解析body
    const { dependencies } = analysisNode(node.body, result, state);
    resultDeclarationObj[local] = createAnalysisNodeResult('', state.uniqueIdGenerator(), dependencies);
    resultObj.dependencies.push(...dependencies);
  } else if (isClassDeclarationNode(node)) {
    // TODO
  }

  if (!isEmptyObject(resultDeclarationObj) && state.topScope().isTopLevelScope()) {
    result.addIdentifiers(false, resultDeclarationObj);
  }

  // statement analysis
  if (isExpressionStatementNode(node)) {
    const statementResult = analysisExpressionStatementNode('', state.uniqueIdGenerator(), node);
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
    state.popScope();
    const statementResult: AnalysisNodeResult = {
      code: '',
      id: state.uniqueIdGenerator(),
      dependencies: needDependencies,
      used: false
    }
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    resultObj.dependencies.push(...needDependencies);
  }

  return resultObj;
}

function analysisExpressionStatementNode(code: string, id: string, node: ExpressionStatementNode): AnalysisNodeResult {
  return createAnalysisNodeResult(code, id, analysisExpressionNode(node.expression));
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
