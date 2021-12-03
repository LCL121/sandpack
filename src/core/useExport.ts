import { CoreState } from './state';
import { useDefinition } from './useDefinition';

export function useExport(name: string, state: CoreState, fileName: string): string | null {
  const exported = state.getFile(fileName).findExported(name);
  let result: string | null = null;
  if (exported) {
    if (Array.isArray(exported)) {
      // TODO allKey
    } else {
      if (exported.local) {
        result = useDefinition(exported.local, state, fileName);
      } else {
        // TODO export * as a from '';
      }
    }
  }
  return result;
}
