"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Card } from "./Card/Card"

export const List = () => {
  const { t } = useTranslation("common");

  const CARDS = [
    {
      title: t("cards.no_adapters_title"),
      subtitle: t("cards.no_adapters_subtitle"),
      progress: 25,
    },
    {
      title: t("cards.instant_switch_title"),
      subtitle: t("cards.instant_switch_subtitle"),
      progress: 50,
    },
    {
      title: t("cards.rj45_monitoring_title"),
      subtitle: t("cards.rj45_monitoring_subtitle"),
      progress: 75,
    },
    {
      title: t("cards.hot_swap_title"),
      subtitle: t("cards.hot_swap_subtitle"),
      progress: 100,
    },
  ];

  return (
    <StyledList>
      <Swiper
        spaceBetween={0}
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        breakpoints={{
          500: { slidesPerView: "auto" },
          0: { slidesPerView: 1 },
        }}
      >
        {CARDS.map((card, index) => (
          <SwiperSlide key={index}>
            <Card {...card} />
          </SwiperSlide>
        ))}
      </Swiper>
    </StyledList>
  );
};

const StyledList = styled.div`
  .swiper-slide {
    margin-bottom: 97px;
    width: max-content !important;
    height: 380px !important;
  }
  @media (max-width: 1000px) {
    .swiper-slide {
      margin-bottom: 60px;
      width: 100% !important;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
