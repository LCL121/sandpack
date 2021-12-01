import { StateAlias, CoreState } from './state';
import { PathOption, Option } from './type';

function initPath(path?: PathOption): StateAlias {
  const result: StateAlias = {};
  for (const key in path) {
    result[key] = {
      origin: path[key],
      loaded: false
    };
  }
  return result;
}

function buildDefaultFile(entry: string, state: CoreState) {
  const statements = state.getFile(entry).allStatements;
  if (statements) {
    for (const statement of statements.statements) {
      // TODO
    }
  }
}

function buildModuleFile() {}

export default function (option: Option): string {
  const { path, entry, loadFunction } = option;
  const state = new CoreState(initPath(path), loadFunction);
  state.loadFile(entry);
  if (state.isFileEmptyExports(entry)) {
    buildDefaultFile(entry, state);
  } else {
    // TODO
  }

  return '';
}
