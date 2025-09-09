"use client";

import icon1 from "@/assets/img/diamand-7.png"
import icon2 from "@/assets/img/diamand-8.png"
import icon3 from "@/assets/img/diamand-9.png"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { AdvantageCard } from "../../../AdvantageCard/AdvantageCard"

const DATA_KEYS = ["advantages.first", "advantages.second", "advantages.third"];

export const List = () => {
  const { t } = useTranslation("common");

  return (
    <StyledList>
      {DATA_KEYS.map((key, i) => (
        <AdvantageCard
          key={i}
          position={i + 1}
          icon={[icon1, icon2, icon3][i]}
          title={t(key).replace(/\n/g, "<br />")}
        />
      ))}
    </StyledList>
  );
};

const StyledList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;
