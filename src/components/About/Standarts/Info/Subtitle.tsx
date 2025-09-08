"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Subtitle = () => {
  const { t } = useTranslation("common");

  return (
    <StyledSubtitle>
      {t("Subtitle.products_full_compliance")} <br />
      {t("Subtitle.products_international_standards")} <br />
      {t("Subtitle.products_safety_quality")}
    </StyledSubtitle>
  );
};

const StyledSubtitle = styled.div`
  font-weight: 400;
  font-size: 19px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 26px;
  @media (max-width: 800px) {
    font-size: 15px;
    line-height: 1.2;
  }
`;
