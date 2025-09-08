import styled from "styled-components";
import { More } from "./More";
import { Text } from "./Text";
import { Earth } from "./Earth";

export const Planet = () => (
  <StyledPlanet className="main-wrapper flex items-center justify-end">
    <More />
    <Text />
    <Earth />
  </StyledPlanet>
);

const StyledPlanet = styled.div`
  padding: 0 20px 197px;
  overflow: hidden;
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: start;
    gap: 30px;
  }
`;
