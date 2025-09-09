"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Card } from "./Card/Card"

export const List = () => {
  const { t } = useTranslation("common");

  const SLIDES = [
    { title: t("ups.features.no_adapters.title"), subtitle: t("ups.features.no_adapters.subtitle"), progress: 25 },
    { title: t("ups.features.instant_switch.title"), subtitle: t("ups.features.instant_switch.subtitle"), progress: 50 },
    { title: t("ups.features.rj45_monitoring.title"), subtitle: t("ups.features.rj45_monitoring.subtitle"), progress: 75 },
    { title: t("ups.features.hot_swap.title"), subtitle: t("ups.features.hot_swap.subtitle"), progress: 100 },
    { title: t("ups.features.no_adapters.title"), subtitle: t("ups.features.no_adapters.subtitle"), progress: 100 },
  ];

  return (
    <StyledList>
      <Swiper
        spaceBetween={20}
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          500: { slidesPerView: "auto", centeredSlides: true },
          0: { slidesPerView: 1, centeredSlides: true },
        }}
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={i}>
            <Card title={slide.title} subtitle={slide.subtitle} progress={slide.progress} />
          </SwiperSlide>
        ))}
      </Swiper>
    </StyledList>
  );
};

const StyledList = styled.div`
  .swiper-slide {
    margin-bottom: 80px;
    width: max-content !important;
    height: auto !important;
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

  .swiper-wrapper {
    padding-bottom: 80px;
  }

  .swiper-pagination {
    bottom: 0;
  }
`;
