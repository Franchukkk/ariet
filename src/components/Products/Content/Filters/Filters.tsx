import styled from "styled-components";
import { Card } from "./Card/Card";

interface Props {
  activeFilters: string[];
  onChangeFilter: (filter: string) => void;
  showFilters: boolean;
}

export const Filters = ({
  activeFilters,
  onChangeFilter,
  showFilters,
}: Props) => (
  <StyledFilters
    className={`flex flex-col gap-[20px] ${showFilters && "showFilters"}`}
  >
    <Card
      title="Категория продукции"
      options={[
        { title: "Название категории", value: "1" },
        { title: "Название категории", value: "2" },
        { title: "Название категории", value: "3" },
        { title: "Название категории", value: "4" },
        { title: "Название категории", value: "5" },
      ]}
      activeFilters={activeFilters}
      onChangeFilter={onChangeFilter}
    />
    <Card
      title="Название фильтра"
      options={[
        { title: "Название категории", value: "21" },
        { title: "Название категории", value: "22" },
        { title: "Название категории", value: "23" },
        { title: "Название категории", value: "24" },
        { title: "Название категории", value: "25" },
      ]}
      activeFilters={activeFilters}
      onChangeFilter={onChangeFilter}
    />
    <Card
      title="Название фильтра"
      options={[
        { title: "Название категории", value: "31" },
        { title: "Название категории", value: "32" },
        { title: "Название категории", value: "33" },
        { title: "Название категории", value: "34" },
        { title: "Название категории", value: "35" },
      ]}
      activeFilters={activeFilters}
      onChangeFilter={onChangeFilter}
    />
  </StyledFilters>
);

const StyledFilters = styled.div`
  @media (max-width: 1100px) {
    display: none;
    &.showFilters {
      display: flex;
    }
  }
`;
