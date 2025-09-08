"use client";

import styled from "styled-components";
import { Title } from "./Title";
import { Grid } from "./Grid/Grid";

export const WhyUs = () => (
  <StyledWhyUs className="main-wrapper">
    <Title />
    <Grid />
  </StyledWhyUs>
);

const StyledWhyUs = styled.div`
  margin-bottom: 131px;
  @media (max-width: 1000px) {
    margin-bottom: 40px;
  }
`;
