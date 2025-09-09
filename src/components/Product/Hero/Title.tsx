import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Title = () => {
  const { t } = useTranslation("common");

  return (
    <StyledTitle
      dangerouslySetInnerHTML={{ __html: t("battery.title") }}
    />
  );
};

const StyledTitle = styled.h1`
  font-weight: 700;
  font-size: 72.65px;
  line-height: 88px;
  letter-spacing: 0%;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 19px;

  span {
    color: transparent;
    -webkit-text-stroke: 1px #fff;
  }

  @media (max-width: 800px) {
    font-size: 40px;
    line-height: 1;
    margin-top: 250px;
  }
`;
