import styled from "styled-components";

export const Title = () => (
  <StyledTile>
    Станьте частью <br /> Ariet Power
  </StyledTile>
);

const StyledTile = styled.h1`
  font-family: TT Firs Neue;
  font-weight: 600;
  font-size: 72.65px;
  line-height: 88px;
  letter-spacing: 0%;
  text-transform: uppercase;
  margin-bottom: 26px;
  @media (max-width: 800px) {
    font-size: 40px;
    line-height: 1.2;
    margin-bottom: 10px;
  }
`;
