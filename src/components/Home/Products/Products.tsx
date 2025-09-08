"use client";

import styled from "styled-components";
import { Header } from "./Header/Header";
import { List } from "./List";
import { Button } from "./Button";

export const Products = () => {
  return (
    <StyledProducts className="main-wrapper">
      <Header />
      <List />
      <Button />
    </StyledProducts>
  );
};

const StyledProducts = styled.div`
  margin-bottom: 142px;
  @media (max-width: 1000px) {
    margin-bottom: 40px;
  }
`;
