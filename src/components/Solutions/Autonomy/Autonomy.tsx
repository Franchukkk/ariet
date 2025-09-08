import styled from "styled-components";
import { Title } from "./Title";
import { Subtitle } from "./Subtitle";
import { Info } from "./Info";

export const Autonomy = () => (
  <StyledAutonomy>
    <div className="flex justify-between top-content">
      <Title />
      <Subtitle />
    </div>
    <Info />
  </StyledAutonomy>
);

const StyledAutonomy = styled.div`
  margin-bottom: 438px;
  padding: 93px 46px 110px 43px;
  border-radius: 8px;
  background: #0d0c0c;
  @media (max-width: 1200px) {
    .top-content {
      flex-direction: column;
      gap: 10px;
    }
  }
`;
