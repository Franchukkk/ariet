
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");
  return <StyledTitle>{t("title.our_advantages")}</StyledTitle>;
};

const StyledTitle = styled.h2`
  font-weight: 500;
  font-size: 50px;
  line-height: 48.91px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 45px;
  @media (max-width: 800px) {
    font-size: 30px;
    text-align: center;
    margin-bottom: 30px;
  }
`;
