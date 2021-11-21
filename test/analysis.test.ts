import analysis from '../src/analysis';
import ast from './analysis.test.json';

const result = analysis(ast);
console.log(result);
