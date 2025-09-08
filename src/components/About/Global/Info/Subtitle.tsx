"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Subtitle = () => {
  const { t } = useTranslation('common');
  return (
    <StyledSubtitle>{ t("Subtitle.we_are_where_reliable_solutions_are_needed")}</StyledSubtitle>
  )
};

const StyledSubtitle = styled.div`
  font-weight: 400;
  font-size: 19px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 31px;
`;
