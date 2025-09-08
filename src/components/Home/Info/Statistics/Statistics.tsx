import styled from "styled-components";
import { Title } from "./Title";
import { Card } from "./Card";

export const Statistics = () => (
  <StyledStatistics>
    <Title />
    <div className="cards flex gap-[46px] flex-wrap">
      <Card
        title="20+"
        description={`лет опыта в разработке и\nпроизводстве решений для\nбесперебойного электропитания`}
      />
      <Card
        title="15+"
        description={`стран, где представлены наши\nпродукты и партнёрская сеть`}
      />
    </div>
  </StyledStatistics>
);

const StyledStatistics = styled.div`
  padding: 56px 80px 63px 49px;
  border-right: 1px dashed #ffffff80;
  @media (max-width: 1200px) {
    border-right: none;
    border-bottom: 1px dashed #ffffff80;
    padding: 30px;
  }
`;
