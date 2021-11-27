import analysis from '../src/analysis';
import fs from 'fs';
import path from 'path';

const source = fs.readFileSync(path.resolve(__dirname, './analysis.test.txt'), 'utf-8');
const result = analysis(source, 'a');
fs.writeFileSync(path.resolve(__dirname, './result.json'), JSON.stringify(result), 'utf-8');
