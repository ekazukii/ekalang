import { useState } from 'react';
import styled from 'styled-components';
import Cheatsheet from './Cheatsheet';

const StyledNavbar = styled.div`
  background-color: black;
  color: white;
  opacity: 0.8;
  padding: 10px;
  width: ${(p: { open: boolean }) => (p.open ? '35vw' : 'auto')};
  display: flex;
  flex-direction: column;
`;

const StyledBtnGroup = styled.div`
  gap: 12px;
  display: flex;
  flex-direction: ${(p: { open: boolean }) => (p.open ? 'row' : 'column')};
  justify-content: center;
`;

const StyledButton = styled.button`
  background-color: inherit;
  color: #b2ffa9;
  border-radius: 6px;
  box-shadow: none;
  border: 1px solid #b2ffa9;
  padding: 5px;
  min-width: 60px;

  &:hover {
    background-color: #b2ffa9;
    color: black;
    cursor: pointer;
  }
`;

const StyledImg = styled.img`
  width: 60px;
`;

const StyledGithub = styled.img`
  filter: invert();
  width: 60px;
`;

const StyledFloat = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
`;

const EkaLogo = styled.a`
  font-family: 'Roboto Slab', serif;
  color: #e76f51;
  margin: 0;
  font-size: 2em;
  text-decoration: none;

  &:hover {
    color: #e76f51;
    text-decoration: underline;
  }
`;

type LateralProps = {
  run: () => void;
  compile: () => void;
};

export default function LateralBar({ run, compile }: LateralProps) {
  const [open, setState] = useState(false);
  return (
    <StyledNavbar open={open}>
      <StyledBtnGroup open={open}>
        <StyledButton onClick={run}>Run</StyledButton>
        <StyledButton onClick={compile}>Compile</StyledButton>
        <StyledButton onClick={() => setState(!open)}>{open ? 'Close cheatsheet' : 'Open cheatsheet'}</StyledButton>
        <StyledButton>Export</StyledButton>
        <StyledButton>Import</StyledButton>
      </StyledBtnGroup>

      {open ? (
        <Cheatsheet />
      ) : (
        <StyledFloat>
          <a href="https://twitter.com/ekazukiii" target="_blank" rel="noreferrer">
            <StyledImg
              src="https://upload.wikimedia.org/wikipedia/fr/thumb/c/c8/Twitter_Bird.svg/1200px-Twitter_Bird.svg.png"
              alt=""
            />
          </a>
          <a href="https://github.com/ekazukii" target="_blank" rel="noreferrer">
            <StyledGithub src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="" />
          </a>
          <EkaLogo href="https://ekazuki.fr" target="_blank" rel="noreferrer">
            Eka'
          </EkaLogo>
        </StyledFloat>
      )}
    </StyledNavbar>
  );
}
