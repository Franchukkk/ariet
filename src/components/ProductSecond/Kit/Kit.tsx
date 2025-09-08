import styled from "styled-components";
import { Title } from "./Title";
import { List } from "./List/List";

export const Kit = () => (
  <StyledKit className="main-wrapper">
    <Title />
    <List />
  </StyledKit>
);

const StyledKit = styled.div`
  margin-bottom: 175px;
  @media (max-width: 1000px) {
    margin-bottom: 40px;
  }
`;
