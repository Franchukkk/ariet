import photo1 from "@/assets/img/kit-1.png"
import photo2 from "@/assets/img/kit-2.png"
import photo3 from "@/assets/img/kit-3.png"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Card } from "./Card"

export const List = () => {
  const { t } = useTranslation("common");

  const cards = [
    { title: t("kit.instruction"), photo: photo1 },
    { title: t("kit.snmp_card"), photo: photo2 },
    { title: t("kit.cable_kit"), photo: photo3 },
  ];

  return (
    <StyledList>
      {cards.map(({ title, photo }, i) => (
        <Card
          key={i}
          title={title.replace(/\n/g, "<br />")}
          photo={photo}
        />
      ))}
    </StyledList>
  );
};

const StyledList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
