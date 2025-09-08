import styled from "styled-components";

export const Title = () => <StyledTitle>Что идёт в комплекте</StyledTitle>;

const StyledTitle = styled.div`
  font-weight: 600;
  font-size: 50px;
  line-height: 58px;
  letter-spacing: 0%;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 70px;
  @media (max-width: 800px) {
    font-size: 30px;
    line-height: 1.2;
    margin-bottom: 30px;
    text-align: center;
  }
`;
