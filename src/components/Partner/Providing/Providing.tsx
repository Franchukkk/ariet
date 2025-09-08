import styled from "styled-components";
import { Title } from "./Title";
import { List } from "./List/List";

export const Providing = () => (
  <StyledProviding>
    <Title />
    <List />
  </StyledProviding>
);

const StyledProviding = styled.div`
  margin-bottom: 142px;
  @media (max-width: 900px) {
    margin-bottom: 30px;
  }
`;
