import styled from "styled-components";

export const Title = () => (
  <StyledTitle>
    ИБП под ваши <br /> параметры
  </StyledTitle>
);

const StyledTitle = styled.h2`
  font-weight: 600;
  font-size: 50px;
  line-height: 48.91px;
  letter-spacing: 0%;
  text-transform: uppercase;
  @media (max-width: 800px) {
    font-size: 30px;
    line-height: 1.2;
  }
`;
