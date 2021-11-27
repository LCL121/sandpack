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

export default function (option: Option): string {
  const { path, entry, loadFunction } = option;
  const state = new CoreState(initPath(path), loadFunction);
  state.loadFile(entry);

  return '';
}
