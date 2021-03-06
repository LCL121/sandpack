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
  isDoWhileStatementNode,
  isExpressionStatementNode,
  isForInStatementNode,
  isForOfStatementNode,
  isForStatementNode,
  isIfStatementNode,
  isLabeledStatementNode,
  isReturnStatementNode,
  isSwitchStatementNode,
  isThrowStatementNode,
  isTryStatementNode,
  isWhileStatementNode
} from '../nodes/statementNodes';
import { isEmptyObject } from '../utils/object';
import { AnalysisResult } from './analysisResult';
import { AnalysisState } from './analysisState';
import { ScopedId } from './constant';
import { analysisPattern } from './analysisPattern';
import { analysisExpressionNode } from './analysisExpression';
import { isAssignmentPatternNode } from '../nodes/patternNode';
import { addSemicolon, getDependency } from '../utils/utils';

interface IAnalysisNodeResult {
  locals: string[];
  dependencies: string[];
}

export function analysisDeclarationNode(
  node: Node,
  result: AnalysisResult,
  state: AnalysisState,
  keyName: string | null = null
) {
  const resultObj: IAnalysisNodeResult = {
    locals: [],
    dependencies: []
  };

  const resultDeclarationObj: AnalysisIdentifierNodeObj = Object.create(null);

  // declaration analysis
  if (isVariableDeclarationNode(node)) {
    let firstLocal = '';
    for (const declaration of node.declarations) {
      const needDependencies: string[] = [];
      if (declaration.init) {
        needDependencies.push(...analysisExpressionNode(declaration.init, result, state));
      }
      resultObj.dependencies.push(...needDependencies);
      for (const { local } of analysisPattern(declaration.id)) {
        if (local === '') {
          continue;
        }
        resultObj.locals.push(local);
        if (!state.topScope().isTopLevelScope()) {
          state.topScope().push(local);
        }
        if (firstLocal === '') {
          resultDeclarationObj[local] = {
            code: state.getCodeByNode(node),
            dependencies: needDependencies,
            id: state.uniqueIdGenerator(),
            used: false
          };
          firstLocal = local;
        } else {
          resultDeclarationObj[local] = {
            code: '',
            dependencies: needDependencies,
            id: state.uniqueIdGenerator(),
            used: false,
            ref: firstLocal
          };
        }
      }
    }
  } else if (isFunctionDeclarationNode(node)) {
    const localName = keyName || node.id.name;
    if (!state.topScope().isTopLevelScope()) {
      state.topScope().push(localName);
    }
    // ????????????????????????params??????es ??????????????????????????????
    state.pushScope(ScopedId.blockScoped);
    const needDependencies: string[] = [];
    // ??????params
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
    // ??????body
    const { dependencies } = analysisNode(node.body, result, state);
    resultDeclarationObj[localName] = createAnalysisIdentifierNodeResult(
      keyName ? addSemicolon(`const ${keyName} = ${state.getCodeByNode(node)}`) : state.getCodeByNode(node),
      state.uniqueIdGenerator(),
      dependencies
    );
    resultObj.dependencies.push(...dependencies, ...needDependencies);
    state.popScope();
  } else if (isClassDeclarationNode(node)) {
    const localName = keyName || node.id.name;
    if (!state.topScope().isTopLevelScope()) {
      state.topScope().push(localName);
    }
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
    resultDeclarationObj[localName] = createAnalysisIdentifierNodeResult(
      keyName ? addSemicolon(`const ${keyName} = ${state.getCodeByNode(node)}`) : state.getCodeByNode(node),
      state.uniqueIdGenerator(),
      dependencies
    );
    resultObj.dependencies.push(...dependencies);
  }

  // ??????top level ???????????????
  if (!isEmptyObject(resultDeclarationObj) && state.topScope().isTopLevelScope()) {
    result.addIdentifiers(false, resultDeclarationObj);
  }

  return resultObj;
}

export function analysisNode(node: Node, result: AnalysisResult, state: AnalysisState): IAnalysisNodeResult {
  const resultObj: IAnalysisNodeResult = {
    locals: [],
    dependencies: []
  };

  const declarationResultObj = analysisDeclarationNode(node, result, state);

  resultObj.locals.push(...declarationResultObj.locals);
  resultObj.dependencies.push(...declarationResultObj.dependencies);

  // statement analysis
  if (isExpressionStatementNode(node)) {
    const statementResult = analysisExpressionStatementNode(state.getCodeByNode(node), node, result, state);
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    for (const dependency of statementResult.dependencies) {
      const key = getDependency(dependency);
      resultObj.dependencies.push(key);
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
    // ???????????????????????????top level scope???????????????????????????
    state.popScope();
    const statementResult: AnalysisStatementNodeResult = {
      code: state.getCodeByNode(node),
      dependencies: needDependencies,
      used: false
    };
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    resultObj.dependencies.push(...needDependencies);
  } else if (isReturnStatementNode(node)) {
    if (node.argument) {
      resultObj.dependencies.push(...analysisExpressionNode(node.argument, result, state));
    }
  } else if (isIfStatementNode(node)) {
    const needDependencies: string[] = [];
    // ????????????scope ??????????????????????????????????????????if statement ??????????????????result ?????????
    state.pushScope(ScopedId.blockScoped);
    needDependencies.push(...analysisExpressionNode(node.test, result, state));
    needDependencies.push(...analysisNode(node.consequent, result, state).dependencies);
    if (node.alternate) {
      needDependencies.push(...analysisNode(node.alternate, result, state).dependencies);
    }
    state.popScope();
    const statementResult: AnalysisStatementNodeResult = {
      code: state.getCodeByNode(node),
      dependencies: needDependencies,
      used: false
    };
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    resultObj.dependencies.push(...needDependencies);
  } else if (isSwitchStatementNode(node)) {
    const needDependencies: string[] = [];
    state.pushScope(ScopedId.blockScoped);
    needDependencies.push(...analysisExpressionNode(node.discriminant, result, state));
    for (const item of node.cases) {
      if (item.test) {
        needDependencies.push(...analysisExpressionNode(item.test, result, state));
      }
      for (const consequent of item.consequent) {
        needDependencies.push(...analysisNode(consequent, result, state).dependencies);
      }
    }
    state.popScope();
    const statementResult: AnalysisStatementNodeResult = {
      code: state.getCodeByNode(node),
      dependencies: needDependencies,
      used: false
    };
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    resultObj.dependencies.push(...needDependencies);
  } else if (isThrowStatementNode(node)) {
    const needDependencies: string[] = [];
    state.pushScope(ScopedId.blockScoped);
    needDependencies.push(...analysisExpressionNode(node.argument, result, state));
    state.popScope();
    const statementResult: AnalysisStatementNodeResult = {
      code: state.getCodeByNode(node),
      dependencies: needDependencies,
      used: false
    };
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    resultObj.dependencies.push(...needDependencies);
  } else if (isTryStatementNode(node)) {
    const needDependencies: string[] = [];
    state.pushScope(ScopedId.blockScoped);
    needDependencies.push(...analysisNode(node.block, result, state).dependencies);
    // catch param
    state.pushScope(ScopedId.blockScoped);
    if (node.handler) {
      if (node.handler.param) {
        for (const { exported } of analysisPattern(node.handler.param)) {
          state.topScope().push(exported);
        }
      }
      needDependencies.push(...analysisNode(node.handler.body, result, state).dependencies);
    }
    state.popScope();
    if (node.finalizer) {
      needDependencies.push(...analysisNode(node.finalizer, result, state).dependencies);
    }
    state.popScope();
    const statementResult: AnalysisStatementNodeResult = {
      code: state.getCodeByNode(node),
      dependencies: needDependencies,
      used: false
    };
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    resultObj.dependencies.push(...needDependencies);
  } else if (isWhileStatementNode(node) || isDoWhileStatementNode(node)) {
    const needDependencies: string[] = [];
    state.pushScope(ScopedId.blockScoped);
    needDependencies.push(...analysisExpressionNode(node.test, result, state));
    needDependencies.push(...analysisNode(node.body, result, state).dependencies);
    state.popScope();
    const statementResult: AnalysisStatementNodeResult = {
      code: state.getCodeByNode(node),
      dependencies: needDependencies,
      used: false
    };
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    resultObj.dependencies.push(...needDependencies);
  } else if (isForStatementNode(node)) {
    const needDependencies: string[] = [];
    state.pushScope(ScopedId.blockScoped);
    if (node.init) {
      if (isVariableDeclarationNode(node.init)) {
        needDependencies.push(...analysisNode(node.init, result, state).dependencies);
      } else {
        needDependencies.push(...analysisExpressionNode(node.init, result, state));
      }
    }
    if (node.test) {
      needDependencies.push(...analysisExpressionNode(node.test, result, state));
    }
    if (node.update) {
      needDependencies.push(...analysisExpressionNode(node.update, result, state));
    }
    needDependencies.push(...analysisNode(node.body, result, state).dependencies);
    // ????????????dependencies
    const finallyDependencies = needDependencies.filter((dependency) => !state.findVar(dependency));
    state.popScope();
    const statementResult: AnalysisStatementNodeResult = {
      code: state.getCodeByNode(node),
      dependencies: finallyDependencies,
      used: false
    };
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    resultObj.dependencies.push(...finallyDependencies);
  } else if (isForInStatementNode(node) || isForOfStatementNode(node)) {
    const needDependencies: string[] = [];
    state.pushScope(ScopedId.blockScoped);
    if (isVariableDeclarationNode(node.left)) {
      needDependencies.push(...analysisNode(node.left, result, state).dependencies);
    } else {
      for (const { exported } of analysisPattern(node.left)) {
        state.topScope().push(exported);
      }
    }
    needDependencies.push(...analysisExpressionNode(node.right, result, state));
    needDependencies.push(...analysisNode(node.body, result, state).dependencies);
    state.popScope();
    const statementResult: AnalysisStatementNodeResult = {
      code: state.getCodeByNode(node),
      dependencies: needDependencies,
      used: false
    };
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    resultObj.dependencies.push(...needDependencies);
  } else if (isLabeledStatementNode(node)) {
    state.pushScope(ScopedId.blockScoped);
    const dependencies = analysisNode(node.body, result, state).dependencies;
    state.popScope();
    const statementResult: AnalysisStatementNodeResult = {
      code: state.getCodeByNode(node),
      dependencies,
      used: false
    };
    result.addStatements(state.topScope().isTopLevelScope(), statementResult);
    resultObj.dependencies.push(...dependencies);
  }

  return resultObj;
}

function analysisExpressionStatementNode(
  code: string,
  node: ExpressionStatementNode,
  result: AnalysisResult,
  state: AnalysisState
): AnalysisStatementNodeResult {
  const tResult: AnalysisStatementNodeResult = Object.create(null);
  tResult.code = code;
  tResult.dependencies = analysisExpressionNode(node.expression, result, state);
  tResult.used = false;
  return tResult;
}

/** ???name ???key */
export interface AnalysisIdentifierNodeObj {
  [key: string]: AnalysisIdentifierNodeResult;
}

export function createAnalysisIdentifierNodeResult(code: string, id: string, dependencies: (string | Dependency)[]) {
  const result: AnalysisIdentifierNodeResult = Object.create(null);
  result.code = code;
  result.id = id;
  result.dependencies = dependencies;
  result.used = false;
  return result;
}

/**
 * ??????????????????
 * statements ??????statement ???????????????
 * ???dependency ???key???
 *    1???dependency: string
 *    2???dependency: Dependency
 *        => ?????????statement???declaration ??????object ???????????????????????????????????????
 *        => ???Dependency.value ???key
 */
export interface AnalysisStatementNodeObj {
  statements: AnalysisStatementNodeResult[];
  [key: string]: number[] | AnalysisStatementNodeResult[];
}

export interface AnalysisStatementNodeResult {
  code: string;
  dependencies: (string | Dependency)[];
  used: boolean;
}

export interface AnalysisIdentifierNodeResult extends AnalysisStatementNodeResult {
  id: string;
  ref?: string;
}

export interface Dependency {
  value: string;
  attributes: string[];
}
