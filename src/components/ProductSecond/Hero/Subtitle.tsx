import styled from "styled-components";

export const Subtitle = () => (
  <StyledSubtitle>
    Безопасное электропитание чувствительной техники. <br /> Защита от молнии и высокочастотных помех. Чистая синусоида.
  </StyledSubtitle>
);

const StyledSubtitle = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-align: center;
  text-transform: uppercase;

  @media (max-width: 800px) {
    font-size: 13px;
    line-height: 1;
    margin-bottom: 30px;
  }
`;
