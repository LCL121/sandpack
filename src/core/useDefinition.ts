import { ImportTypes } from '../nodes/importNode';
import { getDependency } from '../utils/utils';
import { CoreState } from './state';
import { useStatementsByKey } from './useStatement';
import { replace } from './utils';

/**
 * @returns id: 方便statements 等替换
 */
export function useIdentifier(name: string, state: CoreState, fileName: string) {
  const identifier = state.getFile(fileName).findIdentifier(name);
  if (identifier !== undefined) {
    if (identifier.used === false) {
      identifier.used = true;
      let code = replace(identifier.code, { [name]: identifier.id });
      // 处理dependencies 确保code 正确性
      for (const dependency of identifier.dependencies) {
        const key = getDependency(dependency);
        const result = useDefinition(key, state, fileName);
        if (result) {
          code = replace(code, { [key]: result });
        }
      }
      // 处理含identifier 的statements
      useStatementsByKey(name, state, fileName);
      state.addCode(fileName, code);
    }
    return identifier.id;
  }
  return null;
}

export function useImport(name: string, state: CoreState, fileName: string) {
  const importObj = state.getFile(fileName).findImport(name);
  if (importObj) {
    if (importObj.type === ImportTypes.ImportSpecifierType) {
      // import { a as aa } from ''
      if (importObj.imported === null) {
        throw Error('import imported is null');
      }
      state.loadFile(importObj.source);
      state.getFile(importObj.source).findExported(importObj.imported);
      console.log(state);
    } else if (importObj.type === ImportTypes.ImportDefaultSpecifierType) {
      // TODO import a from ''
    } else if (importObj.type === ImportTypes.ImportNamespaceSpecifierType) {
      // TODO import * as a from ''
    }
  }
}

export function useDefinition(name: string, state: CoreState, fileName: string) {
  return useIdentifier(name, state, fileName) || useImport(name, state, fileName);
}
