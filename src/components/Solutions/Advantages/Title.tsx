import styled from "styled-components";

export const Title = () => (
  <StyledTitle>Надёжность при любых внешних воздействиях</StyledTitle>
);

const StyledTitle = styled.div`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-bottom: 63px;
  color: #4bc785;
  @media (max-width: 800px) {
    text-align: center;
  }
`;
