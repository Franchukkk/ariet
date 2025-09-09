"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Subtitle = () => {
  const { t } = useTranslation("common");

  return <StyledSubtitle>{t("Subtitle.subtitle")}</StyledSubtitle>;
};

const StyledSubtitle = styled.div`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #4bc785;
  margin-bottom: 75px;

  @media (max-width: 800px) {
    margin-bottom: 30px;
  }
`;
