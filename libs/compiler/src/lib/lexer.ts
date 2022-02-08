export const operators = {
  numbers: ['ADD', 'SUB', 'MULT', 'DIV', 'MOD'],
  boolean: ['EQ', 'GE', 'G', 'L', 'LE', 'NOTEQ', 'AND', 'OR'],
};
const operations = ['init', 'affect', 'print', 'if', 'else', 'end', 'while'];
const types = ['int', 'string', 'char', 'bool'];

export const lexFile = (data: string) => {
  const lines = intoLines(data);
  const tokens = getTokens(lines);

  return tokens;
};

// Split each line of program in an array of lines
const intoLines = (data: string): Array<string> => {
  let lines: Array<string> = [];

  lines = data.split('\n');

  return lines;
};

// Lex each line of the file to an array of token
const getTokens = (lines: Array<string>) => {
  const tokensArray: Array<Array<Token>> = [];

  lines.forEach((line, index) => {
    if (line == '') return;
    const tokens: Array<Token> = [];
    splitLine(line).forEach((word) => {
      // Ignore comments
      if (word.startsWith('#')) {
        return;
      }

      // Classify token
      if (isOperation(word)) {
        tokens.push({ type: TokenType.OPERATION, id: word, line: index + 1 });
      } else if (isOperator(word)) {
        tokens.push({ type: TokenType.OPERATOR, id: word, line: index + 1 });
      } else if (isNumeric(word)) {
        tokens.push({ type: TokenType.NUMERIC, id: word, line: index + 1 });
      } else if (isBoolean(word)) {
        tokens.push({ type: TokenType.BOOLEAN, id: word, line: index + 1 });
      } else if (isType(word)) {
        tokens.push({ type: TokenType.TYPE, id: word, line: index + 1 });
      } else if (isPunctuation(word)) {
        tokens.push({ type: TokenType.PUNCTUATION, id: word, line: index + 1 });
      } else {
        tokens.push({ type: TokenType.VARIABLE, id: word, line: index + 1 });
      }
    });

    // Pushing token in the array
    tokensArray.push(tokens);
  });
  return tokensArray;
};

// Check if the token is a (numeric or boolean) operator
const isOperator = (strToken: string) => {
  return operators.numbers.includes(strToken) || operators.boolean.includes(strToken);
};

// Check if token is punctuation
const isPunctuation = (strToken: string) => {
  return ['(', ')', '"'].includes(strToken);
};

const isOperation = (strToken: string) => {
  return operations.includes(strToken);
};

const isBoolean = (strToken: string) => {
  return ['true', 'false'].includes(strToken);
};

const isNumeric = (strToken: string) => {
  const num = parseInt(strToken);
  return Number.isInteger(num);
};

const isType = (strToken: string) => {
  return types.includes(strToken);
};

// Split line into an array of Token without classify them
//TODO: handle tabulation
const splitLine = (line: string) => {
  const parsed: Array<string> = [];
  let accumulator = '';
  line.split('').forEach((letter) => {
    if (letter === ' ') {
      if (accumulator.length > 0) {
        parsed.push(accumulator);
        accumulator = '';
      }
    } else if (['(', ')', '"'].includes(letter)) {
      if (accumulator.length > 0) {
        parsed.push(accumulator);
        accumulator = '';
      }
      parsed.push(letter);
    } else {
      accumulator += letter;
    }
  });

  if (accumulator.length > 0) parsed.push(accumulator);

  return parsed;
};

export type Token = {
  id: string;
  type: TokenType;
  line: number;
};

export enum TYPE {
  INT = 'int',
  STRING = 'string',
  CHAR = 'char',
  BOOLEAN = 'bool',
}

export enum TokenType {
  OPERATOR,
  NUMERIC,
  BOOLEAN,
  STRING,
  VARIABLE,
  OPERATION,
  TYPE,
  PUNCTUATION,
}
