import styled from "styled-components";
import { Title } from "./Title";
import { List } from "./List/List";

export const Advantages = () => (
  <StyledAdvantages>
    <Title />
    <List />
  </StyledAdvantages>
);

const StyledAdvantages = styled.div`
  margin-bottom: 132px;
  @media (max-width: 800px) {
    margin-bottom: 30px;
  }
`;
