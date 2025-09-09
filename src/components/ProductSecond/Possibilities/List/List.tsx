"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Card } from "./Card/Card"

const SLIDES = [
  { titleKey: "features.no_adapter.title", subtitleKey: "features.no_adapter.subtitle", progress: 25 },
  { titleKey: "features.instant_switch.title", subtitleKey: "features.instant_switch.subtitle", progress: 50 },
  { titleKey: "features.rj45_monitor.title", subtitleKey: "features.rj45_monitor.subtitle", progress: 75 },
  { titleKey: "features.hot_swap.title", subtitleKey: "features.hot_swap.subtitle", progress: 100 },
  { titleKey: "features.no_adapter.title", subtitleKey: "features.no_adapter.subtitle", progress: 100 },
];

export const List = () => {
  const { t } = useTranslation("common");

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
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={i}>
            <Card
              title={t(slide.titleKey)}
              subtitle={t(slide.subtitleKey)}
              progress={slide.progress}
            />
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
