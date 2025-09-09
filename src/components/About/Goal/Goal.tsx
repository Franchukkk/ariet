"use client"
import styled from "styled-components"
import { Description } from "./Description"
import { Info } from "./Info"

export const Goal = () => (
  <StyledGoal>
    <div className="main-wrapper">
      <Description />
      <Info />
    </div>
  </StyledGoal>
);

const StyledGoal = styled.div`
  margin-bottom: 130px;
  border-bottom: 1px solid #313131;
  .main-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 !important;
  }
  @media (max-width: 1200px) {
    .main-wrapper {
      grid-template-columns: 1fr;
    }
  }
`;
