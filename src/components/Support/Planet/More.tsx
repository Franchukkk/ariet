import Link from "next/link"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const More = () => {
  const { t } = useTranslation("common");

  return <StyledMore href="/">{t("buttons.more")}</StyledMore>;
};

const StyledMore = styled(Link)`
  height: 162px;
  width: 162px;
  background: #1dcf94;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  font-weight: 600;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 1%;
  text-align: center;
  color: #000000;
  margin-right: 160px;
  @media (max-width: 1200px) {
    margin-right: 0;
  }
`;
