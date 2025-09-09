"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");

  return <StyledTitle>{t("title.choose_ariet")}</StyledTitle>;
};

const StyledTitle = styled.h3`
  margin-bottom: 74px;
  font-weight: 600;
  font-size: 50px;
  line-height: 48.91px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;

  @media (max-width: 700px) {
    font-size: 40px;
    margin-bottom: 0px;
    text-align: center;
  }
`;
