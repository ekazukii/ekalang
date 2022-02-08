import styled from 'styled-components';

type ConsoleProps = {
  getInput?: () => string;
  logs: Array<string>;
};

const StyledConsole = styled.div`
  background-color: black;
  font-family: monospace;
  color: white;
  height: 30vh;
  overflow: scroll;
  padding: 10px;
  box-sizing: border-box;
`;

const StyledP = styled.p`
  margin: 1px;
`;

export default function Console({ getInput, logs }: ConsoleProps) {
  return (
    <StyledConsole>
      {logs.map((log, i) => {
        return <StyledP key={i}>{log}</StyledP>;
      })}
    </StyledConsole>
  );
}
