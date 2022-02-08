import { Token, TokenType } from './lexer';
import { parse } from './parser';

describe('Parse Simple operations', function () {
  it('Should parse simple init', function () {
    const AST = parse([
      [
        { id: 'init', type: TokenType.OPERATION, line: 1 },
        { id: 'int', type: TokenType.TYPE, line: 1 },
        { id: 'a', type: TokenType.VARIABLE, line: 1 },
      ],
    ]);

    expect(AST.token.id).toBe('main');
    expect(AST.children.length).toBe(1);
    expect(AST.children[0].token.type).toBe(TokenType.OPERATION);
    expect(AST.children[0].children.length).toBe(2);
    expect(AST.children[0].children[0].token.type).toBe(TokenType.TYPE);
    expect(AST.children[0].children[1].token.type).toBe(TokenType.VARIABLE);
  });

  it('Should parse simple affect', function () {
    const AST = parse([
      [
        { id: 'affect', type: TokenType.OPERATION, line: 1 },
        { id: 'a', type: TokenType.VARIABLE, line: 1 },
        { id: '12', type: TokenType.NUMERIC, line: 1 },
      ],
    ]);

    expect(AST.token.id).toBe('main');
    expect(AST.children.length).toBe(1);
    expect(AST.children[0].token.type).toBe(TokenType.OPERATION);
    expect(AST.children[0].children.length).toBe(2);
    expect(AST.children[0].children[0].token.type).toBe(TokenType.VARIABLE);
    expect(AST.children[0].children[1].token.type).toBe(TokenType.NUMERIC);
  });

  it('Should parse simple print', function () {
    const AST = parse([
      [
        { id: 'print', type: TokenType.OPERATION, line: 1 },
        { id: 'int', type: TokenType.TYPE, line: 1 },
        { id: '12', type: TokenType.NUMERIC, line: 1 },
      ],
    ]);

    expect(AST.token.id).toBe('main');
    expect(AST.children.length).toBe(1);
    expect(AST.children[0].token.type).toBe(TokenType.OPERATION);
    expect(AST.children[0].children.length).toBe(2);
    expect(AST.children[0].children[0].token.type).toBe(TokenType.TYPE);
    expect(AST.children[0].children[1].token.type).toBe(TokenType.NUMERIC);
  });
});

describe('Should parse all types', function () {
  it('Should parse boolean', function () {
    const AST = parse([
      [
        { id: 'affect', type: TokenType.OPERATION, line: 1 },
        { id: 'a', type: TokenType.VARIABLE, line: 1 },
        { id: 'true', type: TokenType.BOOLEAN, line: 1 },
      ],
    ]);

    expect(AST.children[0].children[1].token.type).toBe(TokenType.BOOLEAN);
  });

  it('Should parse string', function () {
    const AST = parse([
      [
        { id: 'print', type: TokenType.OPERATION, line: 1 },
        { id: 'string', type: TokenType.TYPE, line: 1 },
        { id: '"', type: TokenType.PUNCTUATION, line: 1 },
        { id: 'Hello', type: TokenType.VARIABLE, line: 1 },
        { id: 'World', type: TokenType.VARIABLE, line: 1 },
        { id: '"', type: TokenType.PUNCTUATION, line: 1 },
      ],
    ]);

    expect(AST.children[0].children.length).toBe(2);
    expect(AST.children[0].children[1].token.type).toBe(TokenType.STRING);
    expect(AST.children[0].children[1].token.id).toBe('Hello World');
  });
});

describe('Should parse operators', function () {
  it('Should parse numeric operators', function () {
    const AST = parse([
      [
        { id: 'affect', type: TokenType.OPERATION, line: 1 },
        { id: 'a', type: TokenType.VARIABLE, line: 1 },
        { id: 'ADD', type: TokenType.OPERATOR, line: 1 },
        { id: '1', type: TokenType.NUMERIC, line: 1 },
        { id: '12', type: TokenType.NUMERIC, line: 1 },
      ],
    ]);

    expect(AST.children[0].children[1].token.type).toBe(TokenType.OPERATOR);
    expect(AST.children[0].children[1].children.length).toBe(2);
    expect(AST.children[0].children[1].children[0].token.type).toBe(TokenType.NUMERIC);
    expect(AST.children[0].children[1].children[1].token.type).toBe(TokenType.NUMERIC);
  });

  it('Should parse boolean (numeric) operators', function () {
    const AST = parse([
      [
        { id: 'affect', type: TokenType.OPERATION, line: 1 },
        { id: 'a', type: TokenType.VARIABLE, line: 1 },
        { id: 'EQ', type: TokenType.OPERATOR, line: 1 },
        { id: '1', type: TokenType.NUMERIC, line: 1 },
        { id: '12', type: TokenType.NUMERIC, line: 1 },
      ],
    ]);

    expect(AST.children[0].children[1].token.type).toBe(TokenType.OPERATOR);
    expect(AST.children[0].children[1].children.length).toBe(2);
    expect(AST.children[0].children[1].children[0].token.type).toBe(TokenType.NUMERIC);
    expect(AST.children[0].children[1].children[1].token.type).toBe(TokenType.NUMERIC);
  });

  it('Should parse boolean operators', function () {
    const AST = parse([
      [
        { id: 'affect', type: TokenType.OPERATION, line: 1 },
        { id: 'a', type: TokenType.VARIABLE, line: 1 },
        { id: 'OR', type: TokenType.OPERATOR, line: 1 },
        { id: 'true', type: TokenType.BOOLEAN, line: 1 },
        { id: 'false', type: TokenType.BOOLEAN, line: 1 },
      ],
    ]);

    expect(AST.children[0].children[1].token.type).toBe(TokenType.OPERATOR);
    expect(AST.children[0].children[1].children.length).toBe(2);
    expect(AST.children[0].children[1].children[0].token.type).toBe(TokenType.BOOLEAN);
    expect(AST.children[0].children[1].children[1].token.type).toBe(TokenType.BOOLEAN);
  });
});

describe('Should parse multiple lines programs', function () {
  it('Should parse multiple lines programs', function () {
    const AST = parse([
      [
        { id: 'init', type: TokenType.OPERATION, line: 1 },
        { id: 'int', type: TokenType.TYPE, line: 1 },
        { id: 'a', type: TokenType.VARIABLE, line: 1 },
      ],
      [
        { id: 'affect', type: TokenType.OPERATION, line: 2 },
        { id: 'a', type: TokenType.VARIABLE, line: 2 },
        { id: '12', type: TokenType.NUMERIC, line: 2 },
      ],
      [
        { id: 'print', type: TokenType.OPERATION, line: 3 },
        { id: 'int', type: TokenType.TYPE, line: 3 },
        { id: 'a', type: TokenType.VARIABLE, line: 3 },
      ],
    ]);

    expect(AST.children.length).toBe(3);

    expect(AST.children[0].token.id).toBe('init');
    expect(AST.children[0].children.length).toBe(2);

    expect(AST.children[1].token.id).toBe('affect');
    expect(AST.children[1].children.length).toBe(2);

    expect(AST.children[2].token.id).toBe('print');
    expect(AST.children[2].children.length).toBe(2);
  });
});

describe('Should parse flow operations', function () {
  it('Should parse simple if block', function () {
    const AST = parse([
      [
        { id: 'if', type: TokenType.OPERATION, line: 1 },
        { id: 'true', type: TokenType.BOOLEAN, line: 1 },
      ],
      [
        { id: 'print', type: TokenType.OPERATION, line: 2 },
        { id: 'int', type: TokenType.TYPE, line: 2 },
        { id: 'a', type: TokenType.VARIABLE, line: 2 },
      ],
      [{ id: 'end', type: TokenType.OPERATION, line: 3 }],
    ]);

    expect(AST.children.length).toBe(1);
    expect(AST.children[0].token.id).toBe('if');
    expect(AST.children[0].children.length).toBe(2);
    expect(AST.children[0].children[0].token.type).toBe(TokenType.BOOLEAN);
    expect(AST.children[0].children[1].token.id).toBe('run');
    expect(AST.children[0].children[1].children.length).toBe(1);
    expect(AST.children[0].children[1].children[0].token.id).toBe('print');
  });

  it('Should parse simple if else block', function () {
    const AST = parse([
      [
        { id: 'if', type: TokenType.OPERATION, line: 1 },
        { id: 'true', type: TokenType.BOOLEAN, line: 1 },
      ],
      [
        { id: 'print', type: TokenType.OPERATION, line: 2 },
        { id: 'int', type: TokenType.TYPE, line: 2 },
        { id: 'a', type: TokenType.VARIABLE, line: 2 },
      ],
      [{ id: 'else', type: TokenType.OPERATION, line: 3 }],
      [
        { id: 'print', type: TokenType.OPERATION, line: 4 },
        { id: 'string', type: TokenType.TYPE, line: 4 },
        { id: 'a', type: TokenType.VARIABLE, line: 4 },
      ],
      [{ id: 'end', type: TokenType.OPERATION, line: 5 }],
    ]);

    expect(AST.children.length).toBe(1);
    expect(AST.children[0].token.id).toBe('if');
    expect(AST.children[0].children.length).toBe(3);

    //console.log(JSON.stringify(AST));

    expect(AST.children[0].children[0].token.type).toBe(TokenType.BOOLEAN);
    expect(AST.children[0].children[1].token.id).toBe('run');
    expect(AST.children[0].children[1].children[0].children[0].token.id).toBe('int');
    expect(AST.children[0].children[2].token.id).toBe('run');
    expect(AST.children[0].children[2].children[0].children[0].token.id).toBe('string');
  });

  it('Should parse if block with operators', function () {
    const AST = parse([
      [
        { id: 'if', type: TokenType.OPERATION, line: 1 },
        { id: 'NOT', type: TokenType.OPERATOR, line: 1 },
        { id: '1', type: TokenType.NUMERIC, line: 1 },
        { id: '12', type: TokenType.NUMERIC, line: 1 },
      ],
      [
        { id: 'print', type: TokenType.OPERATION, line: 2 },
        { id: 'int', type: TokenType.TYPE, line: 2 },
        { id: 'a', type: TokenType.VARIABLE, line: 2 },
      ],
      [{ id: 'end', type: TokenType.OPERATION, line: 3 }],
    ]);

    expect(AST.children.length).toBe(1);
    expect(AST.children[0].token.id).toBe('if');
    expect(AST.children[0].children.length).toBe(2);
    expect(AST.children[0].children[0].token.type).toBe(TokenType.OPERATOR);
    expect(AST.children[0].children[0].children[0].token.type).toBe(TokenType.NUMERIC);
    expect(AST.children[0].children[0].children[1].token.type).toBe(TokenType.NUMERIC);

    expect(AST.children[0].children[1].token.type).toBe(TokenType.OPERATION);
  });

  it('Should parse simple while block', function () {
    const AST = parse([
      [
        { id: 'while', type: TokenType.OPERATION, line: 1 },
        { id: 'true', type: TokenType.BOOLEAN, line: 1 },
      ],
      [
        { id: 'print', type: TokenType.OPERATION, line: 2 },
        { id: 'int', type: TokenType.TYPE, line: 2 },
        { id: 'a', type: TokenType.VARIABLE, line: 2 },
      ],
      [{ id: 'end', type: TokenType.OPERATION, line: 3 }],
    ]);

    expect(AST.children.length).toBe(1);
    expect(AST.children[0].token.id).toBe('while');
    expect(AST.children[0].children.length).toBe(2);
    expect(AST.children[0].children[0].token.type).toBe(TokenType.BOOLEAN);
    expect(AST.children[0].children[1].token.type).toBe(TokenType.OPERATION);
  });

  it('Should parse while block with operators', function () {
    const AST = parse([
      [
        { id: 'while', type: TokenType.OPERATION, line: 1 },
        { id: 'EQ', type: TokenType.OPERATOR, line: 1 },
        { id: '1', type: TokenType.NUMERIC, line: 1 },
        { id: '12', type: TokenType.NUMERIC, line: 1 },
      ],
      [
        { id: 'print', type: TokenType.OPERATION, line: 2 },
        { id: 'int', type: TokenType.TYPE, line: 2 },
        { id: 'a', type: TokenType.VARIABLE, line: 2 },
      ],
      [{ id: 'end', type: TokenType.OPERATION, line: 3 }],
    ]);

    expect(AST.children.length).toBe(1);
    expect(AST.children[0].token.id).toBe('while');
    expect(AST.children[0].children.length).toBe(2);
    expect(AST.children[0].children[0].token.type).toBe(TokenType.OPERATOR);
    expect(AST.children[0].children[0].children[0].token.type).toBe(TokenType.NUMERIC);
    expect(AST.children[0].children[0].children[1].token.type).toBe(TokenType.NUMERIC);

    expect(AST.children[0].children[1].token.type).toBe(TokenType.OPERATION);
  });
});

describe('Should throw errors', () => {
  it('should throw error on malformed init', () => {
    const tokens: Array<Array<Token>> = [
      [
        { id: 'init', type: TokenType.OPERATION, line: 1 },
        { id: 'int', type: TokenType.VARIABLE, line: 1 },
      ],
    ];

    expect(() => parse(tokens)).toThrowError();
  });
});
