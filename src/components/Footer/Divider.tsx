import styled from "styled-components";

export const Divider = () => <StyledDivider />;

const StyledDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #ebebec47;
  margin: 92px 0 48px;
  @media (max-width: 1000px) {
    margin: 30px 0;
  }
`;
