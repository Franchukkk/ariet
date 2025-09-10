"use client";

import photo1 from "@/assets/img/specification-1.png"
import photo2 from "@/assets/img/specification-2.png"
import cardBorder from "@/assets/img/specification-border.png"
import type { StaticImageData } from "next/image"
import styled from "styled-components"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Card } from "./Card/Card"

type ImgLike = string | StaticImageData;

const slidesData = [
  {

    title: "Защита от помех и грозы",
    subtitle:
      "Ферритовые кольца исключают любые внутренние помехи в электросигнале. Встроенная грозозащита в ИБП автоматически гасит резкие скачки напряжения.",
    slide: 1,
    photo: photo1,
  },
  {

    title: "Бесшумная работа",
    subtitle:
      "Самые тихие вентиляторы из всех возможных.\nИБП часто размещают рядом с\nаппаратами УЗИ, где постоянно\nнаходятся люди.",
    slide: 2,
    photo: photo2,
  },
  {

    title: "Защита от помех и грозы",
    subtitle:
      "Ферритовые кольца исключают любые внутренние помехи в электросигнале. Встроенная грозозащита в ИБП автоматически гасит резкие скачки напряжения.",
    slide: 3,
    photo: photo1,
  },
  {

    title: "Бесшумная работа",
    subtitle:
      "Самые тихие вентиляторы из всех возможных.\nИБП часто размещают рядом с\nаппаратами УЗИ, где постоянно\nнаходятся люди.",
    slide: 4,
    photo: photo2,
  },
];

export const List = () => (
  <StyledList $cardBorder={cardBorder}>
    <Swiper
      spaceBetween={25}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 2000,
        disableOnInteraction: true,
      }}
      pagination={{ clickable: true }}
      breakpoints={{
        1024: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      }}
    >
      {slidesData.map((slide, index) => (
        <SwiperSlide key={index}>
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
