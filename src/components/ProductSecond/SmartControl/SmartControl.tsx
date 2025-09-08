import styled from "styled-components";
import { Header } from "./Header";
import { List } from "./List/List";

export const SmartControl = () => (
  <StyledSmartControl className="main-wrapper">
    <Header />
    <List />
  </StyledSmartControl>
);

const StyledSmartControl = styled.div`
  margin-bottom: 164px;
`;
