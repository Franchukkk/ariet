import styled from "styled-components";

export const Subtitle = () => (
  <StyledSubtitle>
    6кВа/5.4кВт - 10кВа/9кВт Lorem Ipsum - это текст-"рыба", часто используемый
    в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбойё6кВа/5.4кВт
    - 10кВа/9кВт Lorem Ipsum - это т
  </StyledSubtitle>
);

const StyledSubtitle = styled.p`
  max-width: 715px;
  margin: 0 auto 70px;
  font-weight: 300;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 1%;
  text-align: center;
  color: #ffffffa8;
  @media (max-width: 1000px) {
  }
`;
