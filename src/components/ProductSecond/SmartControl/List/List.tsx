import styled from "styled-components";
import { Card } from "./Card";

export const List = () => (
  <StyledList>
    <Card />
    <Card />
    <Card />
    <Card />
  </StyledList>
);

const StyledList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
