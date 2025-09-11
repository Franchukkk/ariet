"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const NewTag = () => {
  const { t } = useTranslation("common");

  return <StyledNewTag>{t("tags.new")}</StyledNewTag>;
};

const StyledNewTag = styled.div`
  position: absolute;
  top: 20px;
  right: 30px;
  padding: 1.5px 11px;
  border: 1px solid #ffffffa8;
  border-radius: 35px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1%;
  text-align: center;
`;
