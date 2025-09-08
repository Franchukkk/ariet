import styled from "styled-components";
import { Title } from "./Title";
import { Buttons } from "./Buttons";
import { Description } from "./Description";

export const TechDescription = () => (
  <StyledTechDescription className="main-wrapper">
    <Title />
    <div className="content">
      <Buttons />
      <Description />
    </div>
  </StyledTechDescription>
);

const StyledTechDescription = styled.div`
  margin-bottom: 141px;
  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 226px;
  }
  @media (max-width: 1300px) {
    .content {
      gap: 70px;
    }
  }
  @media (max-width: 1000px) {
    margin-bottom: 40px;
    .content {
      grid-template-columns: 1fr;
    }
  }
`;
