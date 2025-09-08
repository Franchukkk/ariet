import styled from "styled-components";
import { Title } from "./Title";
import { Subtitle } from "./Subtitle";
import { List } from "./List/List";

export const Possibilities = () => (
  <StyledPossibilities className="main-wrapper">
    <Title />
    <Subtitle />
    <List />
  </StyledPossibilities>
);

const StyledPossibilities = styled.div`
  margin-bottom: 127px;
  @media (max-width: 1000px) {
    margin-bottom: 50px;
  }
`;
