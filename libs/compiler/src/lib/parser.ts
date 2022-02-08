import { Token, TokenType } from './lexer';

// Create an Abstract Syntax Three (AST) from the tokens
export const parse = (tokensSource: Array<Array<Token>>) => {
  const MainAST: AST = {
    token: { id: 'main', type: TokenType.OPERATION, line: -1 },
    children: buildAST(tokensSource),
  };

  return MainAST;
};

// Parse the current block and return an Array of AST
const buildAST = (lines: Array<Array<Token>>): Array<AST> => {
  const ASTList: Array<AST> = [];
  let i = 0;
  let blockNesting = 1;
  // We only parse operation if blockNesting == 1, i.e. if we are in the current block
  while (i < lines.length) {
    const tokens = lines[i];
    // Throw error if line is empty
    if (tokens[0].type !== TokenType.OPERATION) throw new Error('No operation');
    if (['init', 'affect', 'print'].includes(tokens[0].id) && blockNesting == 1) {
      // Parse the inline operation and push it into the array
      ASTList.push(buildInlineOperationAST(tokens));
    } else if (['if', 'while'].includes(tokens[0].id)) {
      // Perform a recursive call to parse the new block and add them into the current AST
      // A typical if block will transform into something like this in AST
      //
      //            IF STATEMENT CHILDREN
      //             0       1        2
      //            /        |         \
      //           /         |          \
      //  CONDITION - OPERATIONSIFTRUE - OPERATIONSIFFALSE
      //
      // The first children of if block has to be an boolean or operator which return boolean
      // The second children is the code to execute if the condition is true
      // The third children is the code to execute if the condition is false
      //
      // While block will be the same but with only the two fist children
      if (blockNesting == 1) {
        ASTList.push({
          token: tokens[0],
          children: [],
        });
        if (tokens[1].type === TokenType.OPERATOR) {
          const opAST: AST = buildOperatorAST(tokens.slice(1));

          const ifAST: AST = {
            token: {
              id: 'run',
              type: TokenType.OPERATION,
              line: tokens[0].line,
            },
            children: buildAST(lines.slice(i + 1)),
          };

          ASTList[ASTList.length - 1].children = [opAST, ifAST];
        } else if (tokens[1].type === TokenType.BOOLEAN) {
          const ifAST: AST = {
            token: {
              id: 'run',
              type: TokenType.OPERATION,
              line: tokens[0].line,
            },
            children: buildAST(lines.slice(i + 1)),
          };

          ASTList[ASTList.length - 1].children = [{ token: tokens[1], children: [] }, ifAST];
        }
      }
      blockNesting++;
    } else if (tokens[0].id === 'else') {
      if (blockNesting == 2) {
        const elseAST: AST = {
          token: {
            id: 'run',
            type: TokenType.OPERATION,
            line: tokens[0].line,
          },
          children: buildAST(lines.slice(i + 1)),
        };

        ASTList[ASTList.length - 1].children.push(elseAST);
      } else if (blockNesting == 1) {
        blockNesting++;
      }
    } else if (tokens[0].id === 'end') {
      blockNesting--;
      if (blockNesting < 1) break;
    }

    i++;
  }

  return ASTList;
};

// Handle AFFECT - INIT - PRINT
// Typical init operation will look like this
//
//     INIT STATEMENT CHILDREN
//             0       1
//            /        |
//           /         |
//     VARTYPE   -  VARNAME
//
const buildInlineOperationAST = (line: Array<Token>) => {
  const AST: AST = {
    token: line[0],
    children: [{ token: line[1], children: [] }],
  };

  switch (line[0].id) {
    case 'init':
      if (line[2].type !== TokenType.VARIABLE) throw new Error('No var name');
      AST.children.push({ token: line[2], children: [] });
      break;
    case 'affect':
      if (line[1].type !== TokenType.VARIABLE) throw new Error('You can only affect variable');
      if (line[2].type === TokenType.OPERATOR) {
        AST.children.push(buildOperatorAST(line.slice(2)));
        break;
      }

      // Parse string
      if (line[2].id === '"') {
        let string = '';
        let i = 3;
        while (i < line.length) {
          if (line[i].id === '"') {
            string = string.slice(1); // Remove first blank space
            AST.children.push({
              token: { type: TokenType.STRING, id: string, line: line[1].line },
              children: [],
            });
            break;
          }
          string += ' ' + line[i].id;
          i++;
        }
        break;
      }

      AST.children.push({ token: line[2], children: [] });
      break;
    case 'print':
      if (line[2].type === TokenType.OPERATOR) {
        AST.children.push(buildOperatorAST(line.slice(2)));
        break;
      }

      // Parse string
      if (line[2].id === '"') {
        let string = '';
        let i = 3;
        while (i < line.length) {
          if (line[i].id === '"') {
            string = string.slice(1); // Remove first blank space
            AST.children.push({
              token: { type: TokenType.STRING, id: string, line: line[1].type },
              children: [],
            });
            break;
          }
          string += ' ' + line[i].id;
          i++;
        }
        break;
      }

      AST.children.push({ token: line[2], children: [] });
      break;
    default:
      console.log(line);
      throw new Error('Operation unknown');
  }

  return AST;
};

// Parse an inline operator (e.g. GE, EQ, OR, ADD ...)
const buildOperatorAST = (tokens: Array<Token>): AST => {
  //console.log(tokens);
  if (tokens[0].type !== TokenType.OPERATOR) throw new Error('No OP');
  const subAST: AST = {
    token: {
      type: TokenType.OPERATOR,
      id: tokens[0].id,
      line: tokens[0].line,
    },
    children: [],
  };

  let i = 1;
  let params = 0;
  while (i < tokens.length) {
    if (tokens[i].type == TokenType.OPERATOR && params < 2) {
      const recursiveAST = buildOperatorAST(tokens.slice(i));
      subAST.children.push(recursiveAST);
      params++;
    } else if (
      tokens[i].type === TokenType.NUMERIC ||
      tokens[i].type === TokenType.VARIABLE ||
      tokens[i].type === TokenType.BOOLEAN
    ) {
      if (params < 2) {
        subAST.children.push({ token: tokens[i], children: [] });
        params++;
      }
    }

    i++;
  }

  return subAST;
};

// Handle IF - ELSE - WHILE
//const buildBlockOperationAST = (tokens: Array<Token>) => {};

export const printTree = (AST: AST, h = 0) => {
  console.log(AST.token.type + '-' + AST.token.id + `(${h})`);
  AST.children.forEach((subAST) => {
    printTree(subAST, h + 1);
  });
};

export enum OPERATION_TYPE {
  INIT = 'init',
  AFFECT = 'affect',
  PRINT = 'print',
}

export type AST = {
  token: Token;
  children: Array<AST>;
};
