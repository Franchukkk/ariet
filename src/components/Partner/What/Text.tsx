import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Text = () => {
  const { t } = useTranslation("common");

  return (
    <StyledText
      dangerouslySetInnerHTML={{ __html: t("Text.partner_support") }}
    />
  );
};

const StyledText = styled.p`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-align: right;
  text-transform: uppercase;
`;
