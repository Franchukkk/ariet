import { useTranslation } from 'react-i18next'
import styled from "styled-components"

export const Title = () => {
  const {t} = useTranslation("common")
  return(
  <StyledTitle>
    {t('title.home_intro')}
  </StyledTitle>
  )
};

const StyledTitle = styled.h3`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 64px;
  @media (max-width: 700px) {
    font-size: 18px;
    line-height: 1.2;
  }
`;
