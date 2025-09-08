"use client"
import styled from "styled-components"
import { Categories } from "../../components/Categories/Categories"
import { Content } from "../../components/Products/Content/Content"

export default function Page() {
  return (
  <StyledProducts>
    <Content />
    <Categories />
    </StyledProducts>
  )
};

const StyledProducts = styled.div`
  padding-top: 81px;
`;
