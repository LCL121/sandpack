import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

function transform(str: string) {
  const targets = [
    'Window.',
    'WindowOrWorkerGlobalScope.',
    'EventTarget.',
    'GlobalEventHandlers.',
    'WindowEventHandlers.'
  ];
  for (const target of targets) {
    if (str.includes(target)) {
      str = str.substring(target.length);
      break;
    }
  }
  const index = str.indexOf('()');
  if (index !== -1) {
    str = str.substring(0, index);
  }
  return str.trim();
}

axios.get('https://developer.mozilla.org/zh-CN/docs/Web/API/Window').then((res) => {
  const set = new Set();
  const $ = cheerio.load(res.data);
  const ids = [
    '#constructors',
    '#属性',
    '#properties_implemented_from_elsewhere',
    '#方法',
    '#methods_implemented_from_elsewhere',
    '#obsolete_methods',
    '#event_handlers',
    '#event_handlers_implemented_from_elsewhere'
  ];
  for (const id of ids) {
    $(id)
      .next()
      .children('dl')
      .children('dt')
      .children('a')
      .children('code')
      .each((i, el) => {
        set.add(transform($(el).text()));
      });
  }
  const eventIds = [
    '#events',
    '#animation_events',
    '#clipboard_events',
    '#connection_events',
    '#focus_events',
    '#gamepad_events',
    '#history_events',
    '#load_unload_events',
    '#manifest_events',
    '#messaging_events',
    '#print_events',
    '#promise_rejection_events',
    '#transition_events',
    '#webvr_events'
  ];
  for (const eventId of eventIds) {
    $(eventId)
      .next()
      .children('dl')
      .children('dd')
      .each((i, el) => {
        const text = $(el).text();
        const find = /Also available via the (.*) /gi.exec(text);
        if (find) {
          set.add(find[1]);
        }
      });
  }
  const data = `/* 通过scripts/windows.ts 自动生成 */
export default ${JSON.stringify(Array.from(set))}`;
  fs.writeFileSync(path.resolve(__dirname, '../src/utils/window.ts'), data);
});
