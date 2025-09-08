import styled from "styled-components";

export const Title = () => (
  <StyledTitle>
    Индивидуальные <br /> решения ИБП под <br /> любые задачи
  </StyledTitle>
);

const StyledTitle = styled.h1`
  font-weight: 600;
  font-size: 72.65px;
  line-height: 88px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-bottom: 92px;
  @media (max-width: 1400px) {
    font-size: 60px;
    line-height: 1.2;
  }
  @media (max-width: 1300px) {
    font-size: 50px;
    line-height: 1.2;
    margin-bottom: 32px;
  }
  @media (max-width: 800px) {
    font-size: 30px;
    text-align: center;
  }
`;
