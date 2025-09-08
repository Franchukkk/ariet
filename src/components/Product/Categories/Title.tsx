import styled from "styled-components";

export const Title = () => <StyledTitle>Категории продукции Ariet</StyledTitle>;

const StyledTitle = styled.h3`
  font-weight: 600;
  font-size: 50px;
  line-height: 48.91px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-bottom: 86px;
  @media (max-width: 1000px) {
    font-size: 30px;
    line-height: 1;
    margin-bottom: 40px;
    text-align: center;
  }
`;
