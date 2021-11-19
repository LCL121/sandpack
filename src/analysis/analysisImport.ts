import { ImportDeclarationNode, ImportTypes, isImportSpecifierNode } from '../nodes/importNode';

export interface ImportResultObj {
  [key: string]: ImportResult;
}

interface ImportResult {
  type: ImportTypes;
  source: string;
  imported: string | null;
}

export function analysisImportDeclaration(node: ImportDeclarationNode): ImportResultObj {
  const resultObj: ImportResultObj = Object.create(null);
  const source = node.source.value;
  for (const specifier of node.specifiers) {
    const localValue = specifier.local.name;
    if (isImportSpecifierNode(specifier)) {
      resultObj[localValue] = createImportResult(specifier.type, source, specifier.imported.name);
    } else {
      resultObj[localValue] = createImportResult(specifier.type, source, localValue);
    }
  }
  return resultObj;
}

function createImportResult(type: ImportTypes, source: string, imported: string | null): ImportResult {
  const result: ImportResult = Object.create(null);
  result.imported = imported;
  result.source = source;
  result.type = type;
  return result;
}
