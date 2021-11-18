import {
  ExportTypes,
  ExportAllDeclarationNode,
  isExportAllDeclarationNode,
  isExportDefaultDeclarationNode,
  isExportNamedDeclarationNode
} from '../nodes/exportNode';
import { throwError } from '../utils/throw';

export interface ExportResultObj {
  [key: string]: ExportResult;
}

interface ExportResult {
  type: ExportTypes;
  local: string | null;
  source: string | null;
}

export const allKey = 'EXPORT_ALL_KEY_SANDPACK';

export function analysisExportAllDeclarationNode(node: ExportAllDeclarationNode): ExportResultObj {
  const resultObj: ExportResultObj = Object.create(null);
  if (node.exported?.name === allKey) {
    throwError(`ExportAllDeclaration can't use ${allKey} `);
  }
  resultObj[node.exported?.name || allKey] = createExportResult(node.type, null, node.source.value);
  return resultObj;
}

function createExportResult(type: ExportTypes, local: string | null, source: string | null): ExportResult {
  const result: ExportResult = Object.create(null);
  result.local = local;
  result.source = source;
  result.type = type;
  return result;
}
