import styled from "styled-components";
import { Info } from "./Info/Info";
import { Cards } from "./Cards/Cards";

export const Standarts = () => (
  <StyledStandarts className="main-wrapper">
    <Info />
    <Cards />
  </StyledStandarts>
);

const StyledStandarts = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 130px;
  gap: 24px;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;
