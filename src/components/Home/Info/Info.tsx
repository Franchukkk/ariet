"use client";

import styled from "styled-components";
import { Statistics } from "./Statistics/Statistics";
import { Description } from "./Description/Description";

export const Info = () => (
  <StyledInfo>
    <div className="main-wrapper">
      <Statistics />
      <Description />
    </div>
  </StyledInfo>
);

const StyledInfo = styled.div`
  padding: 15px 0 24px;
  border-top: 1px solid #313131;
  border-bottom: 1px solid #313131;
  margin-bottom: 63px;
  .main-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 1200px) {
    .main-wrapper {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 1000px) {
    margin-bottom: 40px;
  }
`;
