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

export function relativeToAbsolute(currentPath: string, relativePath: string) {
  const currents = currentPath.split('/');
  // 去掉文件名
  currents.pop();
  const relatives = relativePath.split('/');
  for (const relative of relatives) {
    if (relative === '..') {
      currents.pop();
      if (currents.length === 0) {
        throw Error(`${currentPath} 文件中${relativePath} 路径文件不存在`);
      }
    } else if (relative !== '' && relative !== '.') {
      currents.push(relative);
    }
  }
  return currents.join('/');
}
