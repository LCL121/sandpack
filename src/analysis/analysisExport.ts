import {
  ExportTypes,
  ExportAllDeclarationNode,
  ExportDefaultDeclarationNode,
  ExportNamedDeclarationNode,
  isAnonymousDefaultExportedFunctionDeclaration,
  isAnonymousDefaultExportedClassDeclaration
} from '../nodes/exportNode';
import { throwError } from '../utils/throw';
import { isClassDeclarationNode, isFunctionDeclarationNode } from '../nodes/declarationNode';
import { analysisPattern } from './analysisPattern';
import { allKey, defaultKey } from './constant';
import { analysisDeclarationNode, AnalysisIdentifierNodeObj, createAnalysisIdentifierNodeResult } from './analysisNode';
import { AnalysisResult } from './analysisResult';
import { AnalysisState } from './analysisState';
import { analysisExpressionNode } from './analysisExpression';
import { addSemicolon } from '../utils/utils';
import { isEmptyObject } from '../utils/object';

export interface ExportResultObj {
  [allKey]: ExportResult[];
  [key: string]: ExportResult | ExportResult[];
}

export interface ExportResult {
  type: ExportTypes;
  // 当export * from '' 时为null
  local: string | null;
  // 当from 是有
  source: string | null;
}

export function analysisExportAllDeclarationNode(node: ExportAllDeclarationNode): ExportResultObj {
  const resultObj: ExportResultObj = Object.create(null);
  resultObj[allKey] = [];
  const keyName = node.exported?.name;
  if (keyName === allKey) {
    throwError(`ExportAllDeclaration can't use ${allKey} `);
  } else if (keyName === undefined) {
    resultObj[allKey].push(createExportResult(node.type, null, node.source.value));
  } else {
    resultObj[keyName] = createExportResult(node.type, null, node.source.value);
  }
  return resultObj;
}

/* 由于export default 可以导出expression，因此将其当成一个identifier 进行处理  */
export function analysisExportDefaultDeclarationNode(
  node: ExportDefaultDeclarationNode,
  result: AnalysisResult,
  state: AnalysisState
): ExportResultObj {
  const resultObj: ExportResultObj = Object.create(null);
  if (
    isFunctionDeclarationNode(node.declaration) ||
    isAnonymousDefaultExportedFunctionDeclaration(node.declaration) ||
    isClassDeclarationNode(node.declaration) ||
    isAnonymousDefaultExportedClassDeclaration(node.declaration)
  ) {
    analysisDeclarationNode(node.declaration, result, state, defaultKey);
  } else {
    const resultDeclarationObj: AnalysisIdentifierNodeObj = Object.create(null);
    const code = addSemicolon(`const ${defaultKey} = ${state.getCodeByNode(node.declaration)}`);
    const dependencies = analysisExpressionNode(node.declaration, result, state);
    resultDeclarationObj[defaultKey] = createAnalysisIdentifierNodeResult(
      code,
      state.uniqueIdGenerator(),
      dependencies
    );
    if (!isEmptyObject(resultDeclarationObj) && state.topScope().isTopLevelScope()) {
      result.addIdentifiers(false, resultDeclarationObj);
    }
  }
  resultObj[defaultKey] = createExportResult(node.type, defaultKey, null);
  return resultObj;
}

export function analysisExportNamedDeclarationNode(
  node: ExportNamedDeclarationNode,
  result: AnalysisResult,
  state: AnalysisState
) {
  const resultObj: ExportResultObj = Object.create(null);
  if (node.declaration === null) {
    for (const specifier of node.specifiers) {
      resultObj[specifier.exported.name] = createExportResult(
        node.type,
        specifier.local.name,
        node.source?.value || null
      );
    }
  } else if (isFunctionDeclarationNode(node.declaration)) {
    const keyName = node.declaration.id.name;
    analysisDeclarationNode(node.declaration, result, state);
    resultObj[keyName] = createExportResult(node.type, keyName, null);
  } else {
    analysisDeclarationNode(node.declaration, result, state);
    for (const declaration of node.declaration.declarations) {
      for (const { local, exported } of analysisPattern(declaration.id)) {
        resultObj[exported] = createExportResult(node.type, local, null);
      }
    }
  }
  return resultObj;
}

function createExportResult(type: ExportTypes, local: string | null, source: string | null): ExportResult {
  const result: ExportResult = Object.create(null);
  result.local = local;
  result.source = source;
  result.type = type;
  return result;
}
