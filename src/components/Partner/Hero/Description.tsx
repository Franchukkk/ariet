"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Description = () => {
  const { t } = useTranslation("common");

  return (
    <StyledDescription
      dangerouslySetInnerHTML={{ __html: t("Description.partners_description") }}
    />
  );
};

const StyledDescription = styled.p`
  max-width: 631px;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-transform: uppercase;
`;
