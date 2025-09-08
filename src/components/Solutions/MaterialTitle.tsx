import styled from "styled-components";

export const MaterialTitle = () => (
  <StyledMaterialTitle>
    Мы используем <br /> специальные материалы и <br /> конструктивные решения.
  </StyledMaterialTitle>
);

const StyledMaterialTitle = styled.h2`
  font-weight: 600;
  font-size: 50px;
  line-height: 58px;
  letter-spacing: 0%;
  text-align: right;
  text-transform: uppercase;
  margin-bottom: 105px;
  @media (max-width: 800px) {
    font-size: 30px;
    line-height: 1.2;
  }
`;
