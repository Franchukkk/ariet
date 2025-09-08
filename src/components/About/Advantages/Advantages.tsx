import styled from "styled-components";
import { Title } from "./Title";
import { List } from "./List/List";

export const Advantages = () => (
  <StyledAdvantages className="main-wrapper">
    <Title />
    <List />
  </StyledAdvantages>
);

const StyledAdvantages = styled.div``;
