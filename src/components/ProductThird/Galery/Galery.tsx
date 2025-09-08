import styled from "styled-components";
import { Title } from "./Title";
import { List } from "./List/List";

export const Galery = () => (
  <StyledGalery className="main-wrapper">
    <Title />
    <List />
  </StyledGalery>
);

const StyledGalery = styled.div`
  margin-bottom: 70px;
`;
