import styled from "styled-components";

export const Subtitle = () => (
  <StyledSubtitle>
    <b>Автономная работа до 54 часов.</b> Максимальная защита от скачков
    напряжения. <br /> Идеален для критически важных систем.
  </StyledSubtitle>
);

const StyledSubtitle = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-align: center;
  text-transform: uppercase;
  b {
    font-weight: 400;
    color: #4bc785;
  }
  @media (max-width: 800px) {
    font-size: 13px;
    line-height: 1;
  }
`;
