import styled from "styled-components";
import { Card } from "./Card";
import photo1 from "@/assets/img/kit-1.png";
import photo2 from "@/assets/img/kit-2.png";
import photo3 from "@/assets/img/kit-3.png";

export const List = () => (
  <StyledList>
    <Card title={`Инструкция RU, KAZ`} photo={photo1} />
    <Card title={`SNMP-карта`} photo={photo2} />
    <Card title={`Комплект подключения\nс кабелем 10 м`} photo={photo3} />
  </StyledList>
);

const StyledList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
