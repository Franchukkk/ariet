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

const DATA = [
  {
    id: 1,
    titleKey: "spec.protection_title",
    subtitleKey: "spec.protection_subtitle",
    photo: photo1,
  },
  {
    id: 2,
    titleKey: "spec.silent_title",
    subtitleKey: "spec.silent_subtitle",
    photo: photo2,
  },
];

export const List = () => {
  const { t } = useTranslation("common");

  return (
    <StyledList $cardBorder={cardBorder}>
      <Swiper
        spaceBetween={25}
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        breakpoints={{
          1024: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }}
      >
        {DATA.map((item) => (
          <SwiperSlide key={item.id}>
            <Card
              title={t(item.titleKey)}
              subtitle={t(item.subtitleKey)}
              slide={item.id}
              totalSlides={DATA.length}
              photo={item.photo}
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
