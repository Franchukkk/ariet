"use client";

import photo1 from "@/assets/img/specification-1.png"
import photo2 from "@/assets/img/specification-2.png"
import cardBorder from "@/assets/img/specification-border.png"
import type { StaticImageData } from "next/image"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Card } from "./Card/Card"

type ImgLike = string | StaticImageData;

export const List = () => {
  const { t } = useTranslation("common");

  const slidesData = [
    {
      title: t("specifications.protection.title"),
      subtitle: t("specifications.protection.subtitle"),
      slide: 1,
      photo: photo1,
    },
    {
      title: t("specifications.silent.title"),
      subtitle: t("specifications.silent.subtitle"),
      slide: 2,
      photo: photo2,
    },
    {
      title: t("specifications.protection.title"),
      subtitle: t("specifications.protection.subtitle"),
      slide: 3,
      photo: photo1,
    },
    {
      title: t("specifications.silent.title"),
      subtitle: t("specifications.silent.subtitle"),
      slide: 4,
      photo: photo2,
    },
  ];

  return (
    <StyledList $cardBorder={cardBorder}>
      <Swiper
        spaceBetween={25}
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 2000, disableOnInteraction: true }}
        pagination={{ clickable: true }}
        breakpoints={{ 1024: { slidesPerView: 2 }, 0: { slidesPerView: 1 } }}
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.slide}>
            <Card
              title={slide.title}
              subtitle={slide.subtitle}
              slide={slide.slide}
              totalSlides={slidesData.length}
              photo={slide.photo}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </StyledList>
  );
};

const StyledList = styled.div<{ $cardBorder: ImgLike }>`
  .swiper-slide {
    margin-bottom: 84px;
    position: relative;
    background: ${({ $cardBorder }) =>
      `url(${typeof $cardBorder === "string" ? $cardBorder : $cardBorder.src}) center/cover no-repeat`};
  }
  @media (max-width: 1000px) {
    .swiper-slide {
      margin-bottom: 34px;
    }
  }
`;
