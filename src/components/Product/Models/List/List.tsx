"use client";

import styled from "styled-components"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import photo from "@/assets/img/module.png"
import { useTranslation } from "react-i18next"
import { ModelCard } from "../../../ModelCard/ModelCard"

export const List = () => {
  const { t } = useTranslation("common");

  const MODULES = [
    { id: "1", title: t("products.online_ups"), category: t("products.single_phase"), isNew: false },
    { id: "2", title: t("products.online_ups"), category: t("products.single_phase"), isNew: true },
    { id: "3", title: t("products.online_ups"), category: t("products.single_phase"), isNew: false },
    { id: "4", title: t("products.online_ups"), category: t("products.single_phase"), isNew: false },
    { id: "5", title: t("products.online_ups"), category: t("products.single_phase"), isNew: false },
  ];

  return (
    <StyledList>
      <Swiper
        spaceBetween={0}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: true,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          1024: { slidesPerView: 3 },
          800: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }}
      >
        {MODULES.map((module) => (
          <SwiperSlide key={module.id}>
            <ModelCard
              photo={photo}
              title={module.title}
              category={module.category}
              link="/"
              isNew={module.isNew}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </StyledList>
  );
};

const StyledList = styled.div`
  border-top: 1px dashed #ffffff50;
  padding: 12px 0 14px;

  .swiper-slide {
    border-right: 1px dashed #ffffff50;
    position: relative;

    &::before {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      border-bottom: 1px dashed #ffffff50;
      position: absolute;
      bottom: -14px;
      right: 0;
      left: 0;
    }

    &:last-child {
      border-right: none;
    }
  }

  .swiper-wrapper {
    padding-bottom: 76px;
  }

  @media (max-width: 1000px) {
    .swiper-slide {
      border: none !important;
    }
  }
`;
