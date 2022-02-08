import { operators, TokenType, TYPE } from './lexer';
import { AST } from './parser';

const variables: VariableStorage = {};

export const run = (mainAST: AST, outputFunction: (a: string) => void) => {
  mainAST.children.forEach((AST) => {
    try {
      switch (AST.token.id) {
        case 'init': {
          const type: TYPE = <TYPE>AST.children[0].token.id;
          //console.log('SETTING VARIABLE ' + AST.children[1].token.id);
          variables[AST.children[1].token.id] = {
            type: type,
            value: null,
          };
          break;
        }
        case 'affect': {
          if (AST.children[1].token.type == TokenType.NUMERIC || AST.children[1].token.type == TokenType.STRING) {
            variables[AST.children[0].token.id].value = AST.children[1].token.id;
          } else if (AST.children[1].token.type == TokenType.BOOLEAN) {
            variables[AST.children[0].token.id].value = AST.children[1].token.id === 'true';
          } else if (AST.children[1].token.type == TokenType.OPERATOR) {
            variables[AST.children[0].token.id].value = runExpression(AST.children[1]);
          } else {
            variables[AST.children[0].token.id].value = variables[AST.children[1].token.id].value;
          }

          break;
        }
        case 'print': {
          if (AST.children[1].token.type == TokenType.OPERATOR) {
            outputFunction(runExpression(AST.children[1]));
            break;
          } else if (
            AST.children[1].token.type == TokenType.NUMERIC ||
            AST.children[1].token.type == TokenType.BOOLEAN ||
            AST.children[1].token.type == TokenType.STRING
          ) {
            outputFunction(AST.children[1].token.id);
            break;
          }

          const item = variables[AST.children[1].token.id].value;
          outputFunction(item);
          break;
        }
        case 'if': {
          let condition: any = false;
          if (AST.children[0].token.type == TokenType.OPERATOR) {
            condition = runExpression(AST.children[0]);
            //console.log(condition);
          } else if (AST.children[0].token.type == TokenType.BOOLEAN) {
            condition = AST.children[0].token.id === 'true';
          }
          // NOT THE WAY
          if (condition) {
            //console.log('CONDITION');
            //printTree(AST);
            run(AST.children[1], outputFunction);
          } else {
            run(AST.children[2], outputFunction);
          }
          break;
        }
        case 'while': {
          let wcondition: any = false;
          if (AST.children[0].token.type == TokenType.OPERATOR) {
            wcondition = runExpression(AST.children[0]);
            //console.log(condition);
          } else if (AST.children[0].token.type == TokenType.BOOLEAN) {
            wcondition = AST.children[0].token.id === 'true';
          }

          while (wcondition) {
            run(AST.children[1], outputFunction);

            if (AST.children[0].token.type == TokenType.OPERATOR) {
              wcondition = runExpression(AST.children[0]);
              //console.log(condition);
            } else if (AST.children[0].token.type == TokenType.BOOLEAN) {
              wcondition = AST.children[0].token.id === 'true';
            }
          }
          break;
        }
        case 'run': {
          run(AST, outputFunction);
        }
      }
    } catch (error) {
      if (typeof error === 'string') {
        throw new Error(`[Line ${AST.token.line}] -> ` + error);
      } else if (error instanceof Error) {
        throw new Error(`[Line ${AST.token.line}] -> ` + error.message);
      }
    }
  });
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

const runBooleanComparaison = (AST: AST): boolean => {
  let left = false;
  let right = false;

  switch (AST.children[0].token.type) {
    case TokenType.BOOLEAN:
      left = AST.children[0].token.id == 'true';
      break;
    case TokenType.VARIABLE:
      left = variables[AST.children[0].token.id].value;
      break;
    case TokenType.OPERATOR:
      left = runExpression(AST.children[0]);
      break;
  }

  switch (AST.children[1].token.type) {
    case TokenType.BOOLEAN:
      right = AST.children[1].token.id == 'true';
      break;
    case TokenType.VARIABLE:
      right = variables[AST.children[1].token.id].value;
      break;
    case TokenType.OPERATOR:
      right = runExpression(AST.children[1]);
      break;
  }

  switch (AST.token.id) {
    case 'AND':
      return left && right;
    case 'OR':
      return left || right;
  }

  return false;
};

const runNumericComparaison = (AST: AST): boolean => {
  let left = 0;
  let right = 0;

  switch (AST.children[0].token.type) {
    case TokenType.NUMERIC:
      left = Number(AST.children[0].token.id);
      break;
    case TokenType.VARIABLE:
      left = parseInt(variables[AST.children[0].token.id].value);
      break;
    case TokenType.OPERATOR:
      left = runNumberExpression(AST.children[0]);
      break;
  }

  switch (AST.children[1].token.type) {
    case TokenType.NUMERIC:
      right = Number(AST.children[1].token.id);
      break;
    case TokenType.VARIABLE:
      right = parseInt(variables[AST.children[1].token.id].value);
      break;
    case TokenType.OPERATOR:
      right = runNumberExpression(AST.children[1]);
      break;
  }

  switch (AST.token.id) {
    case 'EQ':
      return left == right;
    case 'GE':
      return left >= right;
    case 'G':
      return left > right;
    case 'L':
      return left < right;
    case 'LE':
      return left <= right;
    case 'NOTEQ':
      return left != right;
  }

  return false;
};

const runNumberExpression = (AST: AST): number => {
  let left = 0;
  let right = 0;

  switch (AST.children[0].token.type) {
    case TokenType.NUMERIC:
      left = Number(AST.children[0].token.id);
      break;
    case TokenType.VARIABLE:
      left = parseInt(variables[AST.children[0].token.id].value);
      break;
    case TokenType.OPERATOR:
      left = runNumberExpression(AST.children[0]);
      break;
  }

  switch (AST.children[1].token.type) {
    case TokenType.NUMERIC:
      right = Number(AST.children[1].token.id);
      break;
    case TokenType.VARIABLE:
      right = parseInt(variables[AST.children[1].token.id].value);
      break;
    case TokenType.OPERATOR:
      right = runNumberExpression(AST.children[1]);
      break;
  }

  switch (AST.token.id) {
    case 'ADD':
      return left + right;
    case 'SUB':
      return left - right;
    case 'MULT':
      return left * right;
    case 'DIV':
      return Math.round(left / right);
    case 'MOD':
      return left % right;
  }

  return 0;
};

export type VariableStorage = {
  [key: string]: {
    type: TYPE;
    value: any;
  };
};
