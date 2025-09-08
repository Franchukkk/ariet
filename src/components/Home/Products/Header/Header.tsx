import styled from "styled-components";
import { Title } from "./Title";
import { Categories } from "./Categories";

export const Header = () => (
  <StyledHeader className="flex items-center justify-between flex-wrap gap-4">
    <Title />
    <Categories />
  </StyledHeader>
);

const StyledHeader = styled.div`
  margin-bottom: 57px;
`;
