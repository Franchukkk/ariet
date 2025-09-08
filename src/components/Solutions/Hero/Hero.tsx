import styled from "styled-components";
import { Title } from "./Title";
import { Subtitle } from "./Subtitle";
import { Background } from "./Background";
import { Product } from "./Product";

export const Hero = () => (
  <StyledHero className="flex items-center justify-between">
    <div>
      <Title />
      <Subtitle />
    </div>
    <Product />
    <Background />
  </StyledHero>
);

const StyledHero = styled.div`
  padding: 20px 46px 0px 34px;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  margin-bottom: 117px;
  @media (max-width: 800px) {
    margin-bottom: 40px;
  }
`;
