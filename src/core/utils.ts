import { AnalysisStatementNodeResult } from '../analysis/analysisNode';
import { getDependency } from '../utils/utils';
import { CoreState } from './state';

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
        const result = useIdentifier(key, state, fileName);
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

export function useStatementsByKey(key: string, state: CoreState, fileName: string) {
  const statements = state.getFile(fileName).findStatement(key);
  if (statements) {
    useStatements(statements, state, fileName);
  }
}

export function useAllStatements(state: CoreState, fileName: string) {
  const statements = state.getFile(fileName).allStatements;
  if (statements) {
    useStatements(statements.statements, state, fileName);
  }
}

function useStatements(statements: AnalysisStatementNodeResult[], state: CoreState, fileName: string) {
  statements.forEach((statement, index) => {
    useStatement(statement, index, state, fileName);
  });
}

function useStatement(statement: AnalysisStatementNodeResult, index: number, state: CoreState, fileName: string) {
  if (statement.used === false) {
    statement.used = true;
    let code = statement.code;
    for (const dependency of statement.dependencies) {
      const key = getDependency(dependency);
      const result = useIdentifier(key, state, fileName);
      if (result) {
        code = replace(code, { [key]: result });
      }
    }
    state.addCode(fileName, code, index);
  }
}

export function replace(target: string, map: { [key: string]: string }): string {
  let need = true;
  let result = target;
  const keys = Object.keys(map);
  const regex = /\w/;
  function replaceSingle() {
    for (let i = 0; i < result.length; i++) {
      if (!regex.test(result[i])) {
        continue;
      }
      let j = i;
      while (j < result.length) {
        if (!regex.test(result[j])) {
          break;
        }
        j++;
      }
      const index = keys.indexOf(result.substring(i, j));
      if (index !== -1) {
        result = `${result.substring(0, i)}${map[keys[index]]}${result.substring(j)}`;
        return;
      }
      i = j;
    }
    need = false;
  }
  while (need) {
    replaceSingle();
  }
  return result;
}
