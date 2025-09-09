import { useTranslation } from 'react-i18next'
import styled from "styled-components"
import { Card } from "./Card"

export const List = () => {
  const { t } = useTranslation("common");
  return(
  <StyledList>
    <Card
  title={t("partners.save_time.title")}
  description={t("partners.save_time.description")}
/>
<Card
  title={t("partners.earn_more.title")}
  description={t("partners.earn_more.description")}
/>
<Card
  title={t("partners.reduce_risks.title")}
  description={t("partners.reduce_risks.description")}
/>
  </StyledList>
  )
};

const StyledList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 42px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;
