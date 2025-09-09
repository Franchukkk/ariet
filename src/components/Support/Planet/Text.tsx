import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Text = () => {
  const { t } = useTranslation("common");

  return <StyledText dangerouslySetInnerHTML={{ __html: t("support.team_text") }} />;
};

const StyledText = styled.p`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  @media (max-width: 700px) {
    font-size: 18px;
    line-height: 1.2;
  }
`;
