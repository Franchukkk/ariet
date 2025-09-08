import styled from "styled-components";
import { Banner } from "./Banner/Banner";
import { Content } from "./Content/Content";

export const Autonomy = () => (
  <StyledAutonomy>
    <div className="main-wrapper">
      <Banner />
      <Content />
    </div>
  </StyledAutonomy>
);

const StyledAutonomy = styled.div`
  margin-bottom: 146px;
  border: 1px solid #313131;
  border-left: none;
  border-right: none;
  .main-wrapper {
    padding: 0 !important;
    display: grid;
    grid-template-columns: 1fr 1fr;
    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 1000px) {
    margin-bottom: 60px;
  }
`;
