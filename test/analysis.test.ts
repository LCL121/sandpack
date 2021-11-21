import analysis from '../src/analysis';
import ast from './analysis.test.json';
import fs from 'fs';
import path from 'path';

const result = analysis(ast);
fs.writeFileSync(path.resolve(__dirname, './result.json'), JSON.stringify(result), 'utf-8');
