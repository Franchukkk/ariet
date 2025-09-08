"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Advantages } from "../Advantages"

type AdvantageItem = {
  id: string;
  icon: string;
  key: string; 
};

const DATA: AdvantageItem[] = [
  { id: "1", icon: "/assets/img/diamand-7.png", key: "advantages.peace_of_mind_and_confidence" },
  { id: "2", icon: "/assets/img/diamand-8.png", key: "advantages.fast_delivery_and_support" },
  { id: "3", icon: "/assets/img/diamand-9.png", key: "advantages.ups_configurator" },
];

export const List = () => {
  const { t } = useTranslation("common");

  return (
    <StyledList>
      {DATA.map(({ id, icon, key }) => (
        <Advantages
          key={id}
          position={Number(id)}
          icon={icon}
          title={t(`${key}`)}
          description={t(`${key}_description`)}
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
