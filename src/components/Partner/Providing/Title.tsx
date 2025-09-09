"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");

  return (
    <StyledTitle
      dangerouslySetInnerHTML={{ __html: t("title.adv_title") }}
    />
  );
};

const StyledTitle = styled.h2`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-bottom: 40px;
  color: #4bc785;

  @media (max-width: 800px) {
    text-align: center;
  }
`;
