import styled from "styled-components";

export const Title = () => (
  <StyledTitle>
    Ключевые <br /> особенности модели
  </StyledTitle>
);

const StyledTitle = styled.h2`
  font-weight: 600;
  font-size: 50px;
  line-height: 58px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-right: 30px;
  @media (max-width: 1000px) {
    font-size: 40px;
    line-height: 1;
  }
  @media (max-width: 800px) {
    font-size: 30px;
    line-height: 1;
  }
`;
