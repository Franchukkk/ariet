"use client";

import styled from "styled-components";
import { AboutUs } from "./AboutUs";
import { Links } from "./Links/Links";
import { Divider } from "./Divider";
import { Info } from "./Info";

export const Footer = () => (
  <StyledFooter className="main-wrapper">
    <div className="flex justify-between top-content">
      <AboutUs />
      <Links />
    </div>
    <Divider />
    <Info />
  </StyledFooter>
);

const StyledFooter = styled.footer`
  background: #0d0c0c;
  border-radius: 12px;
  padding: 78px 48px 50px 50px;
  a:hover {
    color: #4bc785;
  }
  @media (max-width: 1200px) {
    padding: 40px;
  }
  @media (max-width: 1000px) {
    padding: 30px;
    .top-content {
      flex-direction: column;
      gap: 30px;
    }
  }
`;
