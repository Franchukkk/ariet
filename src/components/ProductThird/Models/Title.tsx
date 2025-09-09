import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");

  return <StyledTitle>{t("models.other_models")}</StyledTitle>;
};

const StyledTitle = styled.h3`
  font-weight: 600;
  font-size: 50px;
  line-height: 48.91px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-bottom: 62px;
  @media (max-width: 1000px) {
    font-size: 30px;
    line-height: 1;
    margin-bottom: 20px;
    text-align: center;
  }
`;
