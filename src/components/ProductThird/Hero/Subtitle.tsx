import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Subtitle = () => {
  const { t } = useTranslation("common");

  return (
    <StyledSubtitle
      dangerouslySetInnerHTML={{ __html: t("hero.subtitle") }}
    />
  );
};

const StyledSubtitle = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-align: center;
  text-transform: uppercase;

  b {
    font-weight: 400;
    color: #4bc785;
  }

  @media (max-width: 800px) {
    font-size: 13px;
    line-height: 1;
  }
`;
