import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const TitleBasket = () => {
  const { t } = useTranslation("common");
  return (
    <StyledTitle >{t("title.basket")}</StyledTitle>
  )
}

const StyledTitle = styled.h3`
  font-weight: 600;
  font-size: 50px;
  line-height: 48.91px;
  letter-spacing: 0%;
  text-transform: uppercase;  
  color: #ffffff;

  @media (max-width: 1280px) {
    text-align: center;
    margin-bottom: 20px;
  }
`;