"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Description = () => {
  const { t } = useTranslation("common");

  return (
    <StyledDescription>
      <span className="brand">Ariet Power</span>
      {t("Description.mission_intro")}
      <br />
      {t("Description.mission_power")}
      <br />/ <br />
      {t("Description.mission_products")}
      <br />
      {t("Description.mission_uptime")}
    </StyledDescription>
  );
};

const StyledDescription = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  span {
    color: #4bc785;
  }
  @media (max-width: 800px) {
    font-size: 12px;
    line-height: 1.2;
  }
`;
