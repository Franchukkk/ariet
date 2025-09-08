import styled from "styled-components";

export const Text = () => (
  <StyledText>
    Персонализированная разработка под каждый проект <br /> Мы создаём ИБП,
    которых нет в стандартных каталогах. <br /> Учитываем всё: от технических
    параметров до <br /> особенностей отрасли.
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
