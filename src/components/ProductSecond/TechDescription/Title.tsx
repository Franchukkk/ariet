import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");

  return <StyledTitle>{t("title.technical_info_title")}</StyledTitle>;
};

const StyledTitle = styled.div`
  font-weight: 600;
  font-size: 50px;
  line-height: 58px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-bottom: 77px;

  @media (max-width: 800px) {
    text-align: center;
    font-size: 30px;
    line-height: 1.2;
    margin-bottom: 30px;
  }
`;
