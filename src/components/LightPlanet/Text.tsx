"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Text = () => {
  const { t } = useTranslation("common");

  return (
    <StyledText>
      <h1 dangerouslySetInnerHTML={{ __html: t("Text.heading") }} />
      <p dangerouslySetInnerHTML={{ __html: t("Text.paragraph") }} />
    </StyledText>
  );
};

const StyledText = styled.div`
  max-width: 457px;
  position: relative;
  z-index: 2;
  padding-top: 20px;

  h1 {
    font-weight: 600;
    font-size: 50px;
    line-height: 58px;
    letter-spacing: 0%;
    text-transform: uppercase;
    margin-bottom: 25px;
  }

  p {
    font-weight: 400;
    font-size: 23px;
    line-height: 33px;
    letter-spacing: 0%;
    text-transform: uppercase;
  }
`;
