import { compile as compiler } from './lib/compiler';
import { run } from './lib/interpreter';
import { lexFile } from './lib/lexer';
import { parse } from './lib/parser';

export const interpret = (
  data: string,
  outputFunction: (a: string) => void = console.log
) => {
  return run(parse(lexFile(data)), outputFunction);
};

export const compile = (data: string) => {
  return compiler(parse(lexFile(data)));
};
