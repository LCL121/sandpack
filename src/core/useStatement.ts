import { AnalysisStatementNodeResult } from '../analysis/analysisNode';
import { getDependency } from '../utils/utils';
import { CoreState } from './state';
import { useDefinition } from './useDefinition';
import { replace } from './utils';

export function useStatementsByKey(key: string, state: CoreState, filePath: string) {
  const statements = state.getFile(filePath).findStatement(key);
  if (statements) {
    useStatements(statements, state, filePath);
  }
}

export function useAllStatements(state: CoreState, filePath: string) {
  const statements = state.getFile(filePath).allStatements;
  if (statements) {
    useStatements(statements.statements, state, filePath);
  }
}

function useStatements(statements: AnalysisStatementNodeResult[], state: CoreState, filePath: string) {
  statements.forEach((statement, index) => {
    useStatement(statement, index, state, filePath);
  });
}

function useStatement(statement: AnalysisStatementNodeResult, index: number, state: CoreState, filePath: string) {
  if (statement.used === false) {
    statement.used = true;
    let code = statement.code;
    for (const dependency of statement.dependencies) {
      const key = getDependency(dependency);
      const result = useDefinition(key, state, filePath);
      if (result) {
        code = replace(code, { [key]: result });
      }
    }
    state.addCode(filePath, code, index);
  }
}
