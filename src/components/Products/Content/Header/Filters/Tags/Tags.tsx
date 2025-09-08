import styled from "styled-components";
import { Tag } from "./Tag";

interface Props {
  activeFilters: string[];
  onChangeFilter: (filter: string, isReset?: boolean) => void;
}

export const Tags = ({ activeFilters, onChangeFilter }: Props) => (
  <StyledTags className="flex items-center flex-wrap gap-2">
    {activeFilters.map((filter) => (
      <Tag
        key={filter}
        title={"Название категории"}
        onClick={() => onChangeFilter(filter)}
      />
    ))}
  </StyledTags>
);

const StyledTags = styled.div``;
