import { lexFile, TokenType } from './lexer';

describe('Lex Simple operations', function () {
  it('Should lex simple init', function () {
    const parsed = lexFile('init int a');
    expect(parsed.length).toBe(1);
    expect(parsed[0].length).toBe(3);

    expect(parsed[0][0].type).toBe(TokenType.OPERATION);
    expect(parsed[0][1].type).toBe(TokenType.TYPE);
    expect(parsed[0][2].type).toBe(TokenType.VARIABLE);
  });

  it('Should lex simple affect', function () {
    const parsed = lexFile('affect a 12');
    expect(parsed.length).toBe(1);
    expect(parsed[0].length).toBe(3);

    expect(parsed[0][0].type).toBe(TokenType.OPERATION);
    expect(parsed[0][1].type).toBe(TokenType.VARIABLE);
    expect(parsed[0][2].type).toBe(TokenType.NUMERIC);
  });

  it('Should lex simple print', function () {
    const parsed = lexFile('print int 12');
    expect(parsed.length).toBe(1);
    expect(parsed[0].length).toBe(3);

    expect(parsed[0][0].type).toBe(TokenType.OPERATION);
    expect(parsed[0][1].type).toBe(TokenType.TYPE);
    expect(parsed[0][2].type).toBe(TokenType.NUMERIC);
  });
});

describe('Should lex all types', function () {
  it('Should lex boolean', function () {
    const parsed = lexFile('affect a true');
    expect(parsed[0][2].type).toBe(TokenType.BOOLEAN);
  });

  it('Should lex string', function () {
    const parsed = lexFile('affect a "Hello World"');
    expect(parsed[0][2].type).toBe(TokenType.PUNCTUATION);

    //The lexer doesn't "understand" what's a string at this point so he flag Hello as a variable
    expect(parsed[0][3].type).toBe(TokenType.VARIABLE);
  });
});

describe('Should lex operators', function () {
  it('Should lex numeric operators', function () {
    const parsed = lexFile('affect a ADD 1 12');

    expect(parsed[0][2].type).toBe(TokenType.OPERATOR);
    expect(parsed[0][3].type).toBe(TokenType.NUMERIC);
    expect(parsed[0][4].type).toBe(TokenType.NUMERIC);
  });

  it('Should lex boolean (numeric) operators', function () {
    const parsed = lexFile('affect a EQ 12 24');

    expect(parsed[0][2].type).toBe(TokenType.OPERATOR);
    expect(parsed[0][3].type).toBe(TokenType.NUMERIC);
    expect(parsed[0][4].type).toBe(TokenType.NUMERIC);
  });

  it('Should lex boolean operators', function () {
    const parsed = lexFile('affect a OR true false');

    expect(parsed[0][2].type).toBe(TokenType.OPERATOR);
    expect(parsed[0][3].type).toBe(TokenType.BOOLEAN);
    expect(parsed[0][4].type).toBe(TokenType.BOOLEAN);
  });
});

describe('Should lex multiple lines programs', function () {
  it('Should lex multiple lines programs', function () {
    const parsed = lexFile('init int a\naffect a 12\nprint int a');

    expect(parsed[0].length).toBe(3);
    expect(parsed[0][0].type).toBe(TokenType.OPERATION);
    expect(parsed[0][1].type).toBe(TokenType.TYPE);
    expect(parsed[0][2].type).toBe(TokenType.VARIABLE);

    expect(parsed[1][0].type).toBe(TokenType.OPERATION);
    expect(parsed[1][1].type).toBe(TokenType.VARIABLE);
    expect(parsed[1][2].type).toBe(TokenType.NUMERIC);

    expect(parsed[2][0].type).toBe(TokenType.OPERATION);
    expect(parsed[2][1].type).toBe(TokenType.TYPE);
    expect(parsed[2][2].type).toBe(TokenType.VARIABLE);
  });
});

describe('Should lex flow operations', function () {
  it('Should lex simple if block', function () {
    const parsed = lexFile('if true\nprint int a\nend');
    expect(parsed[0][0].type).toBe(TokenType.OPERATION);
    expect(parsed[0][1].type).toBe(TokenType.BOOLEAN);

    expect(parsed[2][0].type).toBe(TokenType.OPERATION);
  });

  it('Should lex if block with operators', function () {
    const parsed = lexFile('if NOTEQ 1 12\nprint int a\nend');
    expect(parsed[0][0].type).toBe(TokenType.OPERATION);
    expect(parsed[0][1].type).toBe(TokenType.OPERATOR);
    expect(parsed[0][2].type).toBe(TokenType.NUMERIC);
    expect(parsed[0][3].type).toBe(TokenType.NUMERIC);

    expect(parsed[2][0].type).toBe(TokenType.OPERATION);
  });

  it('Should lex simple while block', function () {
    const parsed = lexFile('while true\nprint int a\nend');
    expect(parsed[0][0].type).toBe(TokenType.OPERATION);
    expect(parsed[0][1].type).toBe(TokenType.BOOLEAN);

    expect(parsed[2][0].type).toBe(TokenType.OPERATION);
  });

  it('Should lex while block with operators', function () {
    const parsed = lexFile('while LE 1 12\nprint int a\nend');
    expect(parsed[0][0].type).toBe(TokenType.OPERATION);
    expect(parsed[0][1].type).toBe(TokenType.OPERATOR);
    expect(parsed[0][2].type).toBe(TokenType.NUMERIC);
    expect(parsed[0][3].type).toBe(TokenType.NUMERIC);

    expect(parsed[2][0].type).toBe(TokenType.OPERATION);
  });
});
