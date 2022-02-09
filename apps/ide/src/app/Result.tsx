import { interpret, compile } from '@ekalang/compiler';
import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import styled from 'styled-components';
import Console from './Console';
import LateralBar from './LateralBar';
import useLocalStorage from './useLocalStorage';

const StyledMain = styled.div`
  display: flex;
`;

const StyledContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const StyledText = styled.div`
  height: 70vh;
`;

// Not clean code :'(
let temporaryLogs: Array<string> = [];

const defaultCode =
  'init int index\naffect index 0\nprint string "Looping from 0 to 10"\nwhile LE index 10\n print int index\n affect index ADD 1 index\nend';

export default function Result() {
  const [code, setCode] = useLocalStorage<string>('code', defaultCode);
  const [logs, setLogs] = useState<Array<string>>([]);

  const run = () => {
    if (!code) return;
    try {
      temporaryLogs = ['Running code without error'];
      interpret(code, (str: string) => {
        temporaryLogs.push('[OUT] => ' + str);
        setLogs(temporaryLogs);
      });
    } catch (error) {
      console.log('ERR');
      if (typeof error === 'string') {
        temporaryLogs = ['[ERROR] => ' + error];
      } else if (error instanceof Error) {
        temporaryLogs = ['[ERROR] => ' + error.message];
      }
    }

    setLogs(temporaryLogs);
  };

  const handleCompile = () => {
    if (!code) return;
    const result = compile(code);
    download('code.c', result);
  };

  const download = (filename: string, text: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportFile = () => {
    if (!code) return;
    download('code.eka', code);
  };

  const importFile: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files) {
      console.log('errr');
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], 'UTF-8');
    fileReader.onload = (e) => {
      if (!e.target) {
        console.log('errr');
        return;
      }
      if (typeof e.target.result == 'string') setCode(e.target.result);
    };
  };

  const handleChange = (value: string) => {
    setCode(value);
  };

  return (
    <StyledMain>
      <LateralBar run={run} compile={handleCompile} exportFile={exportFile} importFile={importFile}></LateralBar>
      <StyledContainer>
        <StyledText>
          <CodeMirror
            value={code}
            height="70vh"
            width="100%"
            theme={oneDark}
            extensions={[javascript({ jsx: true })]}
            onChange={handleChange}
          />
        </StyledText>

        <Console logs={logs}></Console>
      </StyledContainer>
    </StyledMain>
  );
}
