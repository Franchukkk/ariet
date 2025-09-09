import { useTranslation } from 'react-i18next'
import styled from "styled-components"

export const Text = () => {
  const {t} = useTranslation("common")
  return (
    <StyledText>
    {t("Text.home_text")}
  </StyledText>
  )
};

const StyledText = styled.p`
  font-weight: 100;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 1%;
  color: #ffffffa8;
`;
