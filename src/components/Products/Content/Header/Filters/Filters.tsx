import styled from "styled-components";
import { Tags } from "./Tags/Tags";
import { CleanButton } from "./CleanButton";
import { ToggleButton } from "./ToggleButton";

interface Props {
  activeFilters: string[];
  onChangeFilter: (filter: string, isReset?: boolean) => void;
  showFilters: boolean;
  onToggleShowFilters: () => void;
}

export const Filters = ({
  activeFilters,
  onChangeFilter,
  showFilters,
  onToggleShowFilters,
}: Props) => (
  <StyledFilters className="flex items-center justify-between gap-3 flex-wrap">
    <Tags activeFilters={activeFilters} onChangeFilter={onChangeFilter} />
    <div className="flex flex-wrap items-center gap-2">
      <ToggleButton active={showFilters} onClick={onToggleShowFilters} />
      <CleanButton onClick={() => onChangeFilter("", true)} />
    </div>
  </StyledFilters>
);

const StyledFilters = styled.div`
  margin-top: 23px;
`;
