import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Breadcrumbs } from "../../Breadcrumbs"
import { Background } from "./Background"
import { Model } from "./Model/Model"
import { Subtitle } from "./Subtitle"
import { Title } from "./Title"

export const Hero = () => {
  const { t } = useTranslation("common");

  return (
    <div className="main-wrapper">
      <StyledHero>
        <Breadcrumbs
          path={[
            t("breadcrumbs.home"),
            t("breadcrumbs.products"),
            t("breadcrumbs.online_ups")
          ]}
        />
        <div className="flex flex-col align-center">
          <Title />
          <Subtitle />
        </div>
        <Model />
        <Background />
        <Background className="second-bg" />
      </StyledHero>
    </div>
  );
};

const StyledHero = styled.div`
  padding: 51px 30px 72px;
  border-radius: 24px;
  margin-bottom: 95px;
  overflow: hidden;
  position: relative;

  .second-bg {
    canvas {
      width: 100% !important;
      height: 192% !important;
      position: absolute;
      top: -117%;
      right: 5px;
      bottom: -214px;
      rotate: 0;

      @media (max-width: 600px) {
        display: none;
      }
    }
  }

  @media (max-width: 800px) {
    padding: 20px;
    margin-bottom: 80px;
  }
`;
