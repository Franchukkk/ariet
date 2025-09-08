"use client";

import styled from "styled-components";
import { Filters } from "./Filters/Filters";
import { Header } from "./Header/Header";
import { List } from "./List";
import { ShowMore } from "./ShowMore";
import { Pagination } from "@/components/Pagination/Pagination";
import { useState } from "react";
import productImg from "@/assets/img/module.png";
import type { StaticImageData } from "next/image";

type ImgLike = string | StaticImageData;

export interface IProduct {
  title: string;
  category: string;
  photo: ImgLike;
  link: string;
}

const productData: IProduct[] = [
  {
    title: "Онлайн ИБП ARIET",
    category: "Однофазные ИБП",
    photo: productImg,
    link: "/",
  },
  {
    title: "Онлайн ИБП ARIET",
    category: "Однофазные ИБП",
    photo: productImg,
    link: "/",
  },
  {
    title: "Онлайн ИБП ARIET",
    category: "Однофазные ИБП",
    photo: productImg,
    link: "/",
  },
  {
    title: "Онлайн ИБП ARIET",
    category: "Однофазные ИБП",
    photo: productImg,
    link: "/",
  },
  {
    title: "Онлайн ИБП ARIET",
    category: "Однофазные ИБП",
    photo: productImg,
    link: "/",
  },
  {
    title: "Онлайн ИБП ARIET",
    category: "Однофазные ИБП",
    photo: productImg,
    link: "/",
  },
];

export const Content = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>(["2"]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 10,
  });
  const [data, setData] = useState<IProduct[]>(productData);
  const [showFilters, setShowFilters] = useState(false);

  const handlePaginationChange = (page: number) =>
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));

  const handleFilterChange = (filter: string, isReset?: boolean) =>
    setActiveFilters((prev) =>
      isReset
        ? []
        : prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );

  const handleLoadMore = () => setData((prev) => [...prev, ...productData]);
  const handleToggleFilters = () => setShowFilters(!showFilters);

  return (
    <StyledContent className="main-wrapper">
      <Filters
        activeFilters={activeFilters}
        onChangeFilter={handleFilterChange}
        showFilters={showFilters}
      />
      <div>
        <Header
          activeFilters={activeFilters}
          onChangeFilter={handleFilterChange}
          showFilters={showFilters}
          onToggleShowFilters={handleToggleFilters}
        />
        <List data={data} />
        <ShowMore onClick={handleLoadMore} />
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePaginationChange}
        />
      </div>
    </StyledContent>
  );
};

const StyledContent = styled.div`
  display: grid;
  grid-template-columns: 390px 1fr;
  gap: 53px;
  grid-auto-rows: max-content;
  margin-bottom: 173px;
  @media (max-width: 1200px) {
    grid-template-columns: 300px 1fr;
    gap: 30px;
  }
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;
