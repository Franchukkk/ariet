import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styled from "styled-components"

export const Button = () => {
  const { t } = useTranslation("common")

  return (
    <StyledButton href="/products">
      {t("Button.catalog")}
    </StyledButton>
  )
}

const StyledButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 58px;
  border-radius: 61px;
  border: 1px solid #4bc785;
  width: 100%;
  transition: all 0.3s;
  &:hover {
    background: #4bc785;
  }
`;
