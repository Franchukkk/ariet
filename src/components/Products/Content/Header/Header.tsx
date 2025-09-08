import styled from "styled-components";
import { Title } from "./Title";
import { Filters } from "./Filters/Filters";

interface Props {
  activeFilters: string[];
  onChangeFilter: (filter: string, isReset?: boolean) => void;
  showFilters: boolean;
  onToggleShowFilters: () => void;
}

export const Header = ({
  activeFilters,
  onChangeFilter,
  showFilters,
  onToggleShowFilters,
}: Props) => (
  <StyledHeader>
    <Title />
    <Filters
      activeFilters={activeFilters}
      onChangeFilter={onChangeFilter}
      showFilters={showFilters}
      onToggleShowFilters={onToggleShowFilters}
    />
  </StyledHeader>
);

const StyledHeader = styled.div`
  margin-bottom: 50px;
`;
