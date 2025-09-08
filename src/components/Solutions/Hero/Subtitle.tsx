import styled from "styled-components";

export const Subtitle = () => (
  <StyledSubtitle>
    Мы проектируем источники бесперебойного питания, которые <br /> идеально
    соответствуют вашим условиям и требованиям.
  </StyledSubtitle>
);

const StyledSubtitle = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-transform: uppercase;
  @media (max-width: 800px) {
    text-align: center;
  }
`;
