import { useTranslation } from 'react-i18next'
import styled from "styled-components"
import { Card } from "./Card"
import { Title } from "./Title"

export const Statistics = () => {
  const {t} = useTranslation("common")
  return(
  <StyledStatistics>
    <Title />
    <div className="cards flex gap-[46px] flex-wrap">
      <Card
        title="20+"
        description={t('Description.experience_text')}
      />
      <Card
        title="15+"
        description={t('Description.countries_text')}
      />
    </div>
  </StyledStatistics>
  )
};

const StyledStatistics = styled.div`
  padding: 56px 80px 63px 49px;
  border-right: 1px dashed #ffffff80;
  @media (max-width: 1200px) {
    border-right: none;
    border-bottom: 1px dashed #ffffff80;
    padding: 30px;
  }
`;
