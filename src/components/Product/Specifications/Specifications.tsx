import styled from "styled-components";
import { Header } from "./Header/Header";
import { List } from "../Specifications/List/List";

export const Specifications = () => (
  <StyledSpecifications className="main-wrapper">
    <Header />
    <List />
  </StyledSpecifications>
);

const StyledSpecifications = styled.div`
  padding: 104px 0 116px;
  @media (max-width: 1000px) {
    padding: 30px 0;
  }
`;
