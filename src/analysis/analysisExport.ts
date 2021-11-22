import {
  ExportTypes,
  ExportAllDeclarationNode,
  ExportDefaultDeclarationNode,
  ExportNamedDeclarationNode
} from '../nodes/exportNode';
import { throwError } from '../utils/throw';
import { isFunctionDeclarationNode } from '../nodes/declarationNode';
import { analysisPattern } from './analysisPattern';
import { allKey } from './constant';

export interface ExportResultObj {
  [allKey]: ExportResult[];
  [key: string]: ExportResult | ExportResult[];
}

export interface ExportResult {
  type: ExportTypes;
  local: string | null;
  source: string | null;
}

export function analysisExportAllDeclarationNode(node: ExportAllDeclarationNode): ExportResultObj {
  const resultObj: ExportResultObj = Object.create(null);
  resultObj[allKey] = [];
  const keyName = node.exported?.name;
  if (keyName === allKey) {
    throwError(`ExportAllDeclaration can't use ${allKey} `);
  } else if (keyName == undefined) {
    resultObj[allKey].push(createExportResult(node.type, null, node.source.value));
  } else {
    resultObj[keyName] = createExportResult(node.type, null, node.source.value);
  }
  return resultObj;
}

export function analysisExportDefaultDeclarationNode(node: ExportDefaultDeclarationNode): ExportResultObj {
  const resultObj: ExportResultObj = Object.create(null);
  const keyName = node.declaration.name;
  resultObj[keyName] = createExportResult(node.type, keyName, null);
  return resultObj;
}

export function analysisExportNamedDeclarationNode(node: ExportNamedDeclarationNode) {
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
    resultObj[keyName] = createExportResult(node.type, keyName, null);
  } else {
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
