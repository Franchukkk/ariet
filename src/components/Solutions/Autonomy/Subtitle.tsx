import styled from "styled-components";

export const Subtitle = () => (
  <StyledSubtitle>
    Мы разрабатываем системы под нужную мощность <br /> и время работы — от
    плавного отключения до <br /> длительной поддержки.
  </StyledSubtitle>
);

const StyledSubtitle = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-align: right;
  text-transform: uppercase;
`;
