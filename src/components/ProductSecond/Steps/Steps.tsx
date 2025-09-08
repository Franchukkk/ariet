import centerIcon from "@/assets/img/data-center.svg"
import hospitalIcon from "@/assets/img/hospital.svg"
import microscopeIcon from "@/assets/img/microscope.svg"
import telecomunicationIcon from "@/assets/img/telecomunication.svg"
import styled from "styled-components"
import { Card } from "./Card"

const STEPS = [
  {id: 1, title: "Медицинские обьекты", icon: hospitalIcon },
  {id: 2, title: "Лаборатории", icon: microscopeIcon },
  {id: 3, title: "Дата-центры и серверные ", icon: centerIcon },
  {id: 4, title: "Телекоммуникации", icon: telecomunicationIcon },
];

export const Steps = () => (
  <StyledSteps>
    <div className="main-wrapper">
      {STEPS.map(({ id, title, icon }) => (
        <Card key={id} step={id} icon={icon} title={title} />
      ))}
    </div>
  </StyledSteps>
);

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
    width: calc(100%);

    .main-wrapper {
      grid-template-columns: 1fr;
      grid-template-rows: 150px;
    }
  }
`;
