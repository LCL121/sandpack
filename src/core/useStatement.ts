import { AnalysisStatementNodeResult } from '../analysis/analysisNode';
import { getDependency } from '../utils/utils';
import { CoreState } from './state';
import { useDefinition } from './useDefinition';
import { replace } from './utils';

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
      const result = useDefinition(key, state, fileName);
      if (result) {
        code = replace(code, { [key]: result });
      }
    }
    state.addCode(fileName, code, index);
  }
}
