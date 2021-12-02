import { CoreState } from './state';

export function useExport(name: string, state: CoreState, fileName: string) {
  state.getFile(fileName).findExported(name);
  const a = state.getFile(fileName).findIdentifier('add');
  console.log(a);
}
