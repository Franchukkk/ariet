import styled from "styled-components";

export const Title = () => (
  <StyledTitle>
    Мы предоставим всё <br /> необходимое, чтобы вы могли:
  </StyledTitle>
);

const StyledTitle = styled.h2`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-bottom: 40px;
  color: #4bc785;
  @media(max-width: 800px) {
    text-align: center;
  }
`;
