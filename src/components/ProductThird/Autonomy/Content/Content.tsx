import styled from "styled-components";
import { Title } from "./Title";
import { List } from "./List/List";

export const Content = () => (
  <StyledContent>
    <Title />
    <List />
  </StyledContent>
);

const StyledContent = styled.div`
  padding: 72px 0px 72px 61px;
  @media (max-width: 1000px) {
    padding: 20px;
  }
`;
