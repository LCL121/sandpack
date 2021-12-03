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
