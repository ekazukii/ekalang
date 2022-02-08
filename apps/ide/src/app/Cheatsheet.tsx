import styled from 'styled-components';

const StyledCode = styled.code`
  color: #b2ffa9;
`;

export default function Cheatsheet() {
  return (
    <div>
      <p>
        Declare a variable {'-> '}
        <StyledCode>init TYPE NAME</StyledCode>
      </p>
      <p>
        Affect a value to variable {'-> '}
        <StyledCode>affect NAME VALUE|VARIABLE</StyledCode>
      </p>
      <p>
        Print value in console {'->'} <StyledCode>print TYPE VALUE|VARIABLE</StyledCode>
      </p>
      <p>
        List of types {'-> '}
        <StyledCode>int (e.g. 41) | bool (e.g. true|false) | string (e.g. "Hello world")</StyledCode>
      </p>
      <p>
        Operator {'-> '}
        <StyledCode>
          OPERATOR PARAM1 {'<'}PARAM2{'>'} (e.g. AND true variable)
        </StyledCode>
      </p>
      <p>
        Numerical comparaison {' -> '}
        <StyledCode>{'LE (<=) | L (<) | GE (>=) | G (>) | EQ (=) | NOTEQ (!=)'}</StyledCode>
      </p>
      <p>
        Numerical operation {' -> '}
        <StyledCode>{'ADD (+) | SUB (-) | MULT (*) | DIV (/) | MOD (%)'}</StyledCode>
      </p>
      <p>
        Boolean operation {' -> '}
        <StyledCode>{'AND (&&) | OR (||)'}</StyledCode>
      </p>
      <p>
        If condition {' -> '}
        <StyledCode>
          if CONDITION\n CODE HERE\n end
          <br />
          if LE 10 12
          <br />
          print string "10 lower or equal than 12"
          <br />
          else
          <br />
          print string "Error: 10 greater than 12"
          <br />
          end
        </StyledCode>
      </p>
      <p>
        While loop {'-> '}
        <StyledCode>
          while CONDITION\n StyledCode HERE\n end
          <br />
          while LE i 12
          <br />
          print string "10 lower or equal than 12"
          <br />
          affect i ADD i 1
          <br />
          end
        </StyledCode>
      </p>
    </div>
  );
}
