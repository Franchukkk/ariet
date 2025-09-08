import styled from "styled-components";

export const Text = () => (
  <StyledText>
    Стать партнёром Ariet Power — значит войти в наш <br /> мир и получить
    доступ не только к <br /> высокотехнологичной продукции, но и к <br />{" "}
    персональному сопровождению, которое <br /> отличает нас от других.
  </StyledText>
);

const StyledText = styled.p`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-align: right;
  text-transform: uppercase;
`;
