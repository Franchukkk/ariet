import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Subtitle = () => {
  const { t } = useTranslation("common");

  return <StyledSubtitle dangerouslySetInnerHTML={{ __html: t("banner.subtitle") }} />;
};

const StyledSubtitle = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-transform: uppercase;
  @media (max-width: 800px) {
    text-align: center;
  }
`;
