import { operators, TokenType, TYPE } from './lexer';
import { AST, printTree } from './parser';

//const variables: VariableStorage = {};
let buffer = '';
let indent = 0;

export const compile = (mainAST: AST) => {
  addBuffer('#include <stdio.h>');
  addBuffer('int main() {');
  indent = 2;
  processBlock(mainAST);
  indent = 0;
  addBuffer('}');
  return buffer;
};

export const processBlock = (mainAST: AST) => {
  mainAST.children.forEach((AST) => {
    switch (AST.token.id) {
      case 'init': {
        const type: TYPE = <TYPE>AST.children[0].token.id;
        const name = AST.children[1].token.id;
        const ctype = typeToCType(type);
        if (!isCVarName(name)) break;
        addBuffer(`${ctype} ${name};`);
        break;
      }
      case 'affect': {
        switch (AST.children[1].token.type) {
          case TokenType.NUMERIC:
            addBuffer(`${AST.children[0].token.id} = ${AST.children[1].token.id};`);
            break;
          case TokenType.BOOLEAN:
            addBuffer(`${AST.children[0].token.id} = ${AST.children[1].token.id == 'true' ? 1 : 0};`);
            break;
          case TokenType.STRING:
            addBuffer(`${AST.children[0].token.id} = "${AST.children[1].token.id};"`);
            break;
          case TokenType.OPERATOR:
            addBuffer(`${AST.children[0].token.id} = (${runExpression(AST.children[1])});`);
            break;
        }
        break;
      }
      case 'print': {
        const printType = typeToPrintType(<TYPE>AST.children[0].token.id);
        switch (AST.children[1].token.type) {
          case TokenType.VARIABLE:
            addBuffer(`printf("${printType}\\n", ${AST.children[1].token.id});`);
            break;
          case TokenType.NUMERIC:
            addBuffer(`printf("${printType}\\n", ${AST.children[1].token.id});`);
            break;
          case TokenType.BOOLEAN:
            addBuffer(`printf("${printType}\\n", ${AST.children[1].token.id == 'true' ? 1 : 0});`);
            break;
          case TokenType.STRING:
            addBuffer(`printf("${printType}\\n", "${AST.children[1].token.id}");`);
            break;
          case TokenType.OPERATOR:
            addBuffer(`printf("${printType}\\n", (${runExpression(AST.children[1])}));`);
            break;
        }
        break;
      }
      case 'if': {
        let condition: any = false;
        if (AST.children[0].token.type == TokenType.OPERATOR) {
          condition = runExpression(AST.children[0]);
          //console.log(condition);
        } else if (AST.children[0].token.type == TokenType.BOOLEAN) {
          condition = AST.children[0].token.id == 'true' ? '1 == 1' : '1 == 2';
        }

        addBuffer(`if (${condition}) {`);
        indent++;
        processBlock(AST.children[1]);
        indent--;
        addBuffer(`}`);
        break;
      }
      case 'while': {
        let condition: any = false;
        if (AST.children[0].token.type == TokenType.OPERATOR) {
          condition = runExpression(AST.children[0]);
          //console.log(condition);
        } else if (AST.children[0].token.type == TokenType.BOOLEAN) {
          condition = AST.children[0].token.id == 'true' ? '1 == 1' : '1 == 2';
        }

        addBuffer(`while (${condition}) {`);
        indent++;
        processBlock(AST.children[1]);
        indent--;
        addBuffer(`}`);
        break;
      }
    }
  });
};

const typeToCType = (type: TYPE) => {
  switch (type) {
    case TYPE.INT:
      return 'int';
    case TYPE.BOOLEAN:
      return 'int';
    case TYPE.CHAR:
      return 'char';
    case TYPE.STRING:
      return 'char*';
  }
};

const typeToPrintType = (type: TYPE) => {
  switch (type) {
    case TYPE.INT:
      return '%d';
    case TYPE.BOOLEAN:
      return '%d';
    case TYPE.CHAR:
      return '%c';
    case TYPE.STRING:
      return '%s';
  }
};

const runExpression = (AST: AST): any => {
  if (operators.numbers.includes(AST.token.id)) {
    return runNumberExpression(AST);
  } else if (operators.boolean.includes(AST.token.id)) {
    if (['AND', 'OR'].includes(AST.token.id)) {
      return runBooleanComparaison(AST);
    } else {
      return runNumericComparaison(AST);
    }
  }
};

const runNumberExpression = (AST: AST): string => {
  let left = '0';
  let right = '0';

  switch (AST.children[0].token.type) {
    case TokenType.NUMERIC:
      left = AST.children[0].token.id;
      break;
    case TokenType.VARIABLE:
      left = AST.children[0].token.id;
      break;
    case TokenType.OPERATOR:
      left = '(' + runNumberExpression(AST.children[0]) + ')';
      break;
  }

  switch (AST.children[1].token.type) {
    case TokenType.NUMERIC:
      right = AST.children[1].token.id;
      break;
    case TokenType.VARIABLE:
      right = AST.children[1].token.id;
      break;
    case TokenType.OPERATOR:
      right = '(' + runNumberExpression(AST.children[1]) + ')';
      break;
  }

  switch (AST.token.id) {
    case 'ADD':
      return `${left} + ${right}`;
    case 'SUB':
      return `${left} - ${right}`;
    case 'MULT':
      return `${left} * ${right}`;
    case 'DIV':
      return `${left} / ${right}`;
    case 'MOD':
      return `${left} % ${right}`;
  }

  return '0';
};

const runNumericComparaison = (AST: AST): string => {
  let left = '0';
  let right = '0';

  switch (AST.children[0].token.type) {
    case TokenType.NUMERIC:
      left = AST.children[0].token.id;
      break;
    case TokenType.VARIABLE:
      left = AST.children[0].token.id;
      break;
    case TokenType.OPERATOR:
      left = '(' + runNumberExpression(AST.children[0]) + ')';
      break;
  }

  switch (AST.children[1].token.type) {
    case TokenType.NUMERIC:
      right = AST.children[1].token.id;
      break;
    case TokenType.VARIABLE:
      right = AST.children[1].token.id;
      break;
    case TokenType.OPERATOR:
      right = '(' + runNumberExpression(AST.children[1]) + ')';
      break;
  }

  switch (AST.token.id) {
    case 'EQ':
      return `${left} == ${right}`;
    case 'GE':
      return `${left} >= ${right}`;
    case 'G':
      return `${left} > ${right}`;
    case 'L':
      return `${left} < ${right}`;
    case 'LE':
      return `${left} <= ${right}`;
    case 'NOTEQ':
      return `${left} != ${right}`;
  }

  return '1 == 2';
};

const runBooleanComparaison = (AST: AST): string => {
  let left = '0';
  let right = '0';

  switch (AST.children[0].token.type) {
    case TokenType.BOOLEAN:
      left = AST.children[0].token.id == 'true' ? '1' : '0';
      break;
    case TokenType.VARIABLE:
      left = AST.children[0].token.id;
      break;
    case TokenType.OPERATOR:
      left = runExpression(AST.children[0]);
      break;
  }

  switch (AST.children[1].token.type) {
    case TokenType.BOOLEAN:
      right = AST.children[1].token.id == 'true' ? '1' : '0';
      break;
    case TokenType.VARIABLE:
      right = AST.children[0].token.id;
      break;
    case TokenType.OPERATOR:
      right = runExpression(AST.children[1]);
      break;
  }

  switch (AST.token.id) {
    case 'AND':
      return `${left} && ${right}`;
    case 'OR':
      return `${left} || ${right}`;
  }

  return '1 == 0';
};

const isCVarName = (name: string) => {
  return true;
};

const addBuffer = (line: string) => {
  for (let index = 0; index < indent; index++) {
    buffer += '  ';
  }
  buffer += line + '\n';
};

const types: any = {};

const setType = (name: string, type: TYPE) => {
  types[name] = type;
};

const getType = (name: string) => {
  return types[name];
};
