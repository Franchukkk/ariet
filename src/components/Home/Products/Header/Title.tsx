"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");
  return <StyledTitle>{t("title.our_products")}</StyledTitle>;
};

const StyledTitle = styled.h3`
  font-weight: 600;
  font-size: 50px;
  line-height: 48.91px;
  letter-spacing: 0%;
  text-transform: uppercase;  
  color: #ffffff;

  @media (max-width: 800px) {
    text-align: center;
  }
`;




/*<StyledTitle>Наша продукция</StyledTitle>*/