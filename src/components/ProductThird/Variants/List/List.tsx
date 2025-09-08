"use client";

import styled from "styled-components";
import { Card } from "./Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css/pagination";

export const List = () => (
  <StyledList className="flex">
    <Swiper
      spaceBetween={8}
      modules={[Autoplay]}
      //   autoplay={{
      //     delay: 2000,
      //     // disableOnInteraction: true,
      //   }}
      breakpoints={{
        500: {
          slidesPerView: "auto",
        },
        0: {
          slidesPerView: 1,
        },
      }}
    >
      <SwiperSlide>
        <Card active />
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
      <SwiperSlide>
        <Card />
      </SwiperSlide>
    </Swiper>
  </StyledList>
);

const StyledList = styled.div`
  .swiper-slide {
    width: max-content !important;
    height: 83px !important ;
  }
`;
