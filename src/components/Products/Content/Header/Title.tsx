import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");
  return <StyledTitle>{t("products.title")}</StyledTitle>;
};

const StyledTitle = styled.h1`
  font-weight: 600;
  font-size: 43.3px;
  line-height: 48.91px;
  letter-spacing: 0%;
  text-transform: uppercase;
  @media (max-width: 800px) {
    font-size: 30px;
    line-height: 1.2;
  }
`;
