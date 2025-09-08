"use client";

import styled from "styled-components"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Card } from "./Card"

export const List = () => (
  <StyledList>
    <Swiper
      spaceBetween={22}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 2000,
        disableOnInteraction: true,
      }}
      pagination={{ clickable: true }}
      loop={true}
      breakpoints={{
        1024: {
          slidesPerView: 3,
        },
        800: {
          slidesPerView: 2,
        },
        0: {
          slidesPerView: 1,
        },
      }}
    >
      <SwiperSlide>
        <Card />
      </SwiperSlide>
      <SwiperSlide>
        <Card />
      </SwiperSlide>
      <SwiperSlide>
        <Card />
      </SwiperSlide>
      <SwiperSlide>
        <Card />
      </SwiperSlide>
    </Swiper>
  </StyledList>
);

const StyledList = styled.div`
  padding: 12px 0 14px;
  .swiper-wrapper {
    padding-bottom: 76px;
  }
  /* прибрав width: max-content, бо він заважає */
  .swiper-slide {
    display: flex; /* щоб Card займав усю висоту */
    justify-content: center;
  }
`;
