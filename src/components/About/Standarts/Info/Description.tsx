"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Description = () => {
  const { t } = useTranslation("common");
  return (
    <StyledDescription>
      {t("Description.service_before_purchase")}
      <br />
      {t("Description.service_after_purchase")}
      <br />
      {t("Description.customer_satisfaction")}
    </StyledDescription>
  );
};

const StyledDescription = styled.p`
  font-weight: 100;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 1%;
  color: #ffffffa8;
`;
