import styled from "styled-components";
import { Card } from "./Card";

export const List = () => (
  <StyledList>
    <Card
      title="Экономьте время"
      description={`Готовые промо-материалы\nИндивидуальное планирование проектов\nЭксклюзивные инструменты`}
    />
    <Card
      title="Зарабатывайте больше"
      description={`Поддержка в продвижении\nСовместное участие в акциях и мероприятиях\nКоммерческие привилегии`}
    />
    <Card
      title="Снижайте риски"
      description={`Прозрачные условия\nПомощь на всех этапах\nПостоянное присутствие и техподдержка`}
    />
  </StyledList>
);

const StyledList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 42px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;
