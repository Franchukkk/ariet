import centerIcon from "@/assets/img/data-center.svg"
import hospitalIcon from "@/assets/img/hospital.svg"
import microscopeIcon from "@/assets/img/microscope.svg"
import telecomunicationIcon from "@/assets/img/telecomunication.svg"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Card } from "./Card"

const STEPS = [
  { id: 1, titleKey: "steps.medical", icon: hospitalIcon },
  { id: 2, titleKey: "steps.laboratories", icon: microscopeIcon },
  { id: 3, titleKey: "steps.data_centers", icon: centerIcon },
  { id: 4, titleKey: "steps.telecom", icon: telecomunicationIcon },
];

export const Steps = () => {
  const { t } = useTranslation("common");

  return (
    <StyledSteps>
      <div className="main-wrapper">
        {STEPS.map(({ id, titleKey, icon }, i) => (
          <Card key={id} step={1 + i} icon={icon} title={t(titleKey)} />
        ))}
      </div>
    </StyledSteps>
  );
};

const StyledSteps = styled.div`
  padding: 20px 0 22px;
  border: 1px dashed #ffffff45;
  border-left: none;
  border-right: none;
  position: relative;
  width: calc(100% + 54px);
  margin-left: -54px;
  .main-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 272px;
  }
  @media (max-width: 1000px) {
    border: none;
    margin-left: 0px;
    width: 100%;

    .main-wrapper {
      grid-template-columns: 1fr;
      grid-template-rows: 150px;
    }
  }
`;
