import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

function transform(str: string) {
  const index = str.indexOf('()');
  if (index !== -1) {
    str = str.substring(0, index);
  }
  return str.trim();
}

axios.get('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects').then((res) => {
  const set = new Set();
  const $ = cheerio.load(res.data);
  $('.toggle details')
    .children('summary')
    .each((i, el) => {
      if ($(el).text() === '内置对象') {
        $(el)
          .parent()
          .children('ol')
          .children('li')
          .each((ti, tel) => {
            set.add(transform($(tel).text()));
          });
      }
    });
  const data = `/* 通过scripts/js.ts 自动生成 */
export default ${JSON.stringify(Array.from(set))}`;
  fs.writeFileSync(path.resolve(__dirname, '../src/utils/js.ts'), data);
});
