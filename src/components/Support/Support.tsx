"use client";

import styled from "styled-components";
import { Title } from "./Title";
import { Info } from "./Info";
import { Planet } from "./Planet/Planet";




export const Support = () => (
  <StyledSupport className="support-wrapper">
    <Title />
    <Info />
    <Planet />
  </StyledSupport>
);

const StyledSupport = styled.div`
  padding: 157px 0 115px;
  position: relative;
  overflow: hidden;
  @media (max-width: 1200px) {
    padding: 100px 0;
  }
  @media (max-width: 1000px) {
    padding: 50px 0;
  }
`;
