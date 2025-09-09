import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");
  return <StyledTitle>{t("technical_info.title")}</StyledTitle>;
};

const StyledTitle = styled.h3`
  font-weight: 600;
  font-size: 50px;
  line-height: 58px;
  letter-spacing: 0%;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 40px;
  @media (max-width: 1000px) {
    font-size: 30px;
    line-height: 1;
    margin-bottom: 20px;
  }
`;
