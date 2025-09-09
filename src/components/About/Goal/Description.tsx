"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Description = () => {
  const { t } = useTranslation("common");

  return (
    <StyledDescription>
      <p className="text">
        <span className="highlight">{t("Description.goal")}</span>{" "}
        {t("Description.premium")}
        <br />
        {t("Description.equipment")}
        <br />
        {t("Description.price_quality")}
        <br />
        {t("Description.power_protection")}
        <br />
        {t("Description.business_around")}{" "}
        {t("Description.partners")}
      </p>

      <div className="bg-text">{t("Description.mission")}</div>
    </StyledDescription>
  );
};

const StyledDescription = styled.div`
  padding: 128px 10px 387px 0px;
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffff;
  border-right: 1px solid #313131;
  position: relative;
  overflow: hidden;
  p {
    padding-left: 53px;
  }
  span {
    color: #4bc785;
  }
  .bg-text {
    position: absolute;
    bottom: 0;
    left: -10px;
    font-weight: 900;
    font-size: 136.99px;
    line-height: 178.04px;
    letter-spacing: 0%;
    text-transform: uppercase;
    white-space: nowrap;
    color: transparent;
    -webkit-text-stroke: 0.8px #ffffff1f;
  }
  @media (max-width: 1200px) {
    padding: 30px 10px 80px;
    border-right: none;
    border-bottom: 1px solid #313131;
    font-size: 18px;
    line-height: 1.2;

    p {
      padding-left: 0;
    }
  }
`;
