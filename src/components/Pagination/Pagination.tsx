import styled from "styled-components";
import BackButtonIcon from "@/assets/img/back.svg";
import NextButtonIcon from "@/assets/img/next.svg";
import More from "@/assets/img/more.svg";
import { Button } from "./Button";
import React from "react";

interface Props {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const getPages = (current: number, total: number) => {
  // Повертає масив сторінок та маркерів "..."
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, "...", total];
  }
  if (current >= total - 2) {
    return [1, "...", total - 2, total - 1, total];
  }
  return [1, "...", current, "...", total];
};

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: Props) => {
  const pages = getPages(currentPage, totalPages);

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <StyledPagination className="flex items-center justify-center gap-2">
      <span
        style={{
          opacity: currentPage === 1 ? 0.5 : 1,
          cursor: currentPage === 1 ? "default" : "pointer",
        }}
        onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
      >
        <BackButtonIcon />
      </span>
      {pages.map((page, idx) =>
        page === "..." ? (
          <Button key={idx}>
            <More />
          </Button>
        ) : (
          <Button
            key={idx}
            active={page === currentPage}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </Button>
        )
      )}
      <span
        style={{
          opacity: currentPage === totalPages ? 0.5 : 1,
          cursor: currentPage === totalPages ? "default" : "pointer",
        }}
        onClick={() =>
          currentPage < totalPages && onPageChange?.(currentPage + 1)
        }
      >
        <NextButtonIcon />
      </span>
    </StyledPagination>
  );
};

const StyledPagination = styled.div`
  svg {
    cursor: pointer;
    path {
      transition: all 0.3s;
      &:hover {
        fill: #1dcf94 !important;
      }
    }
  }
`;
