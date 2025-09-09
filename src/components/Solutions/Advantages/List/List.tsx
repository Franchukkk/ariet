import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Card } from "./Card"

export const List = () => {
  const { t } = useTranslation("common");

  const DATA = [
    t("environment.extreme_temperatures"),
    t("environment.high_altitude"),
    t("environment.humidity_dust_corrosion"),
    t("environment.vibrations_mechanical_loads"),
  ];

  return (
    <StyledList>
      {DATA.map((title, i) => (
        <Card key={i} position={1 + i} title={title} />
      ))}
    </StyledList>
  );
};

const StyledList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: end;
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
