import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");

  return (
    <StyledTitle className="main-wrapper support-title" dangerouslySetInnerHTML={{ __html: t("support.title_support") }} />
  );
};

const StyledTitle = styled.h3`
  font-weight: 600;
  font-size: 50px;
  line-height: 58px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  text-align: center;
  margin-bottom: 53px;
  br {
    display: none;
  }
  @media (max-width: 1000px) {
    font-size: 30px;
    line-height: 1.2;
    margin-bottom: 30px;
  }
`;
