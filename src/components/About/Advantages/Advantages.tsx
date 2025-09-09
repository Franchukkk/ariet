"use client";
import styled from "styled-components"
import { List } from "./List/List"
import { Title } from "./Title"

export const Advantages = () => (
  <StyledAdvantages className="main-wrapper">
    <Title />
    <List />
  </StyledAdvantages>
);

const StyledAdvantages = styled.div``;
