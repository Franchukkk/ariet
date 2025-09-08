import styled from "styled-components";

export const Title = () => (
  <StyledTitle>
    Ariet Power — энергия, на которую <br /> можно положиться <br /> / <br />
    Наши ИБП, стабилизаторы и аккумуляторные системы защищают критически важные
    объекты по всему миру — от дата-центров до промышленных предприятий.
  </StyledTitle>
);

const StyledTitle = styled.h3`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 64px;
  @media (max-width: 700px) {
    font-size: 18px;
    line-height: 1.2;
  }
`;
