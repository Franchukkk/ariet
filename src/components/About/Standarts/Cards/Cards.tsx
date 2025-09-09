"use client";

import icon2 from "@/assets/img/standart-2.png"
import icon3 from "@/assets/img/standart-3.png"
import icon1 from "@/assets/img/standart.png"
import type { StaticImageData } from "next/image"
import type { ComponentType, SVGProps } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Card } from "./Card"

type Item = {
  titleKey: string;
  icon?: StaticImageData | ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
};

const DATA: Item[] = [
  { titleKey: "card.tuv", icon: icon1 },
  { titleKey: "card.ce", icon: icon2 },
  { titleKey: "card.bureau_veritas", icon: icon3 },
  { titleKey: "card.efficiency", className: "outline-card" },
];

export const Cards = () => {
  const { t } = useTranslation("common");

  return (
    <StyledCards>
      {DATA.map(({ titleKey, icon, className }) => (
        <Card
          key={titleKey}
          title={t(titleKey)}
          icon={icon}
          className={className}
        />
      ))}
    </StyledCards>
  );
};

const StyledCards = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 201px;
  gap: 12px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-auto-rows: 170px;
  }
`;
