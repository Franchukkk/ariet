import styled from "styled-components";
import { Title } from "./Title";
import { List } from "./List/List";

export const Variants = () => (
  <StyledVariants className="main-wrapper">
    <Title />
    <List />
  </StyledVariants>
);

const StyledVariants = styled.div`
  margin: 50px auto 66px;
`;
