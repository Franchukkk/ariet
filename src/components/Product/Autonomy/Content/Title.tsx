import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <StyledTitle className="!mb-[30px]"> {t("battery.hr_title")} <span className="text-[#4BC785]">{t("battery.hr_title_2")}</span></StyledTitle>
      <StyledTitle>{t("battery.hr_title_3")}</StyledTitle>
    </>
  );
};

const StyledTitle = styled.p`
  font-weight: 400;
  font-size: 23px;
  line-height: 33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-bottom: 95px;

  b {
    color: #4bc785;
    font-weight: 500;
  }

  @media (max-width: 800px) {
    font-size: 18px;
    line-height: 140%;
    margin-bottom: 40px;
  }
`;
