"use client";

import { useTranslation } from "react-i18next"
import styled from "styled-components"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import photo from "@/assets/img/module.png"
import { ModelCard } from "../../../ModelCard/ModelCard"

export const List = () => {
  const { t } = useTranslation("common");

  const MODELS = [
    { title: t("models.online_ups"), category: t("models.single_phase"), link: "/", isNew: false },
    { title: t("models.online_ups"), category: t("models.single_phase"), link: "/", isNew: true },
    { title: t("models.online_ups"), category: t("models.single_phase"), link: "/", isNew: false },
    { title: t("models.online_ups"), category: t("models.single_phase"), link: "/", isNew: false },
    { title: t("models.online_ups"), category: t("models.single_phase"), link: "/", isNew: false },
  ];

  return (
    <StyledList>
      <Swiper
        spaceBetween={0}
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        breakpoints={{
          1024: { slidesPerView: 3 },
          800: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }}
      >
        {MODELS.map((model, index) => (
          <SwiperSlide key={index}>
            <ModelCard {...model} photo={photo} />
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

    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      border-bottom: 1px dashed #ffffff50;
      position: absolute;
      bottom: 0;
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
      &::after {
        display: none;
      }
    }
  }
`;
