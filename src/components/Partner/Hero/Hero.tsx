import styled from "styled-components";
import { Title } from "./Title";
import { Subtitle } from "./Subtitle";
import { Description } from "./Description";
import { Banner } from "./Banner";

export const Hero = () => (
  <StyledHero className="flex items-center justify-between">
    <div>
      <Title />
      <Subtitle />
      <Description />
    </div>
    <Banner />
  </StyledHero>
);

const StyledHero = styled.div`
  padding: 85px 60px 43px 39px;
  margin-bottom: 125px;
  @media (max-width: 1000px) {
    flex-direction: column;
    margin-bottom: 60px;
    padding: 30px;
    gap: 30px;
    align-items: center;
  }
  @media (max-width: 800px) {
    padding: 30px 0 0 0px;
  }
`;
