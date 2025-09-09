"use client"
import styled from "styled-components"
import { Cards } from "./Cards/Cards"
import { Info } from "./Info/Info"

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
