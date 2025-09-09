"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
   const { t } = useTranslation("common");
  return (
    <StyledTitle>
      {t("title.about_company")} <br />
      Ariet Power
    </StyledTitle>
  )
};

const StyledTitle = styled.h1`
  font-weight: 600;
  font-size: 72.65px;
  line-height: 88px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  @media (max-width: 800px) {
    font-size: 40px;
    line-height: 1.2;
    margin-bottom: 20px;
  }
`;
