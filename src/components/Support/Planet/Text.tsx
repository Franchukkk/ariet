import styled from "styled-components";

export const Text = () => (
  <StyledText>
    Наша квалифицированная команда технической <br /> поддержки и отдела продаж
    всегда готова <br /> помочь / <br />
    от предварительного выбора продукта до <br /> постпродажного обслуживания.
  </StyledText>
);

const StyledText = styled.p`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  @media (max-width: 700px) {
    font-size: 18px;
    line-height: 1.2;
  }
`;
