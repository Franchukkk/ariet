import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Subtitle = () => {
  const { t } = useTranslation("common");

  return <StyledSubtitle>{t("technical.subtitle")}</StyledSubtitle>;
};

const StyledSubtitle = styled.p`
  max-width: 715px;
  margin: 0 auto 70px;
  font-weight: 300;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 1%;
  text-align: center;
  color: #ffffffa8;
  @media (max-width: 1000px) {
  }
`;
