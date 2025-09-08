"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Description } from "./Description"
import { List } from "./List"
import { Subtitle } from "./Subtitle"
import { Title } from "./Title"

export const Info = () => {
  const { t } = useTranslation("common");

  return (
    <StyledInfo>
      <Title />
      <Subtitle />
      <Description
        text={t("Info.own_modern_factories")}
        className="!text-white"
      />
      <List />
      <Description
        text={t("Info.global_network_and_support")}
      />
    </StyledInfo>
  );
};

const StyledInfo = styled.div`
  padding: 96px 48px 84px 0px;
  border-right: 1px solid #313131;

  @media (max-width: 1200px) {
    border-bottom: 1px solid #313131;
    border-right: none;
  }

  @media (max-width: 800px) {
    padding: 30px 0;
  }
`;
