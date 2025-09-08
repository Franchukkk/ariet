import styled from "styled-components";
import { Info } from "./Info/Info";
import { Network } from "./Network/Network";

export const Global = () => (
  <StyledGlobal>
    <div className="main-wrapper">
      <Info />
      <Network />
    </div>
  </StyledGlobal>
);

const StyledGlobal = styled.div`
  border: 1px solid #313131;
  border-left: none;
  border-right: none;
  margin-bottom: 40px;
  .main-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 1200px) {
    .main-wrapper {
      grid-template-columns: 1fr;
    }
  }
`;
