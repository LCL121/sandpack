import { ImportTypes } from '../nodes/importNode';
import { getDependency } from '../utils/utils';
import { CoreState } from './state';
import { useExport } from './useExport';
import { useStatementsByKey } from './useStatement';
import { relativeToAbsolute, replace } from './utils';

/**
 * @returns id: 方便statements 等替换
 */
export function useIdentifier(name: string, state: CoreState, filePath: string) {
  const identifier = state.getFile(filePath).findIdentifier(name);
  if (identifier !== undefined) {
    if (identifier.used === false) {
      identifier.used = true;
      let code = replace(identifier.code, { [name]: identifier.id });
      // 处理dependencies 确保code 正确性
      for (const dependency of identifier.dependencies) {
        const key = getDependency(dependency);
        const result = useDefinition(key, state, filePath);
        if (result) {
          code = replace(code, { [key]: result });
        }
      }
      // 处理含identifier 的statements
      useStatementsByKey(name, state, filePath);
      state.addCode(filePath, code);
    }
    return identifier.id;
  }
  return null;
}

export function useImport(name: string, state: CoreState, filePath: string) {
  const importObj = state.getFile(filePath).findImport(name);
  let result: string | null = null;
  if (importObj) {
    if (importObj.type === ImportTypes.ImportSpecifierType) {
      // import { a as aa } from ''
      if (importObj.imported === null) {
        throw Error('import imported is null');
      }
      const realSource = relativeToAbsolute(filePath, importObj.source);
      state.loadFile(realSource);
      state.addFileDependencies(filePath, realSource);
      result = useExport(importObj.imported, state, realSource);
    } else if (importObj.type === ImportTypes.ImportDefaultSpecifierType) {
      // TODO import a from ''
      const realSource = relativeToAbsolute(filePath, importObj.source);
      state.loadFile(realSource);
      state.addFileDependencies(filePath, realSource);
      result = useExport(importObj.imported!, state, realSource);
    } else if (importObj.type === ImportTypes.ImportNamespaceSpecifierType) {
      // TODO import * as a from ''
    }
  }
  return result;
}

export function useDefinition(name: string, state: CoreState, filePath: string): string | null {
  return useIdentifier(name, state, filePath) || useImport(name, state, filePath);
}
