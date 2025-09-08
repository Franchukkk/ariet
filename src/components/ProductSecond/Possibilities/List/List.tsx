"use client";

import styled from "styled-components"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Card } from "./Card/Card"

export const List = () => (
  <StyledList>
    <Swiper
      spaceBetween={0}
      modules={[Pagination, Autoplay]}
      //   autoplay={{
      //     delay: 2000,
      //     // disableOnInteraction: true,
      //   }}
      pagination={{ clickable: true }}
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
        <Card
          title="Подключение без адаптеров"
          subtitle="4 европейских розетки «Sсhuko» из качественного пластика. Идеальны для медицинского оборудования.
"
          progress={25}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          title="Мгновенное переключение за 0 мс"
          subtitle="Холодный запуск и незаметный переход на резервное питание без отключения оборудования."
          progress={50}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          title="Встроенный мониторинг RJ45"
          subtitle="4 европейских розетки «Sсhuko» из качественного пластика. Идеальны для медицинского оборудования.
"
          progress={75}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          title="Горячая замена АКБ"
          subtitle="Для замены батарей не нужно отключать ИБП. 
Открыли крышку, вытащили кассету, вставили новую – система продолжает работать.
"
          progress={100}
        />
      </SwiperSlide>{" "}
      <SwiperSlide>
        <Card
          title="Подключение без адаптеров"
          subtitle="4 европейских розетки «Sсhuko» из качественного пластика. Идеальны для медицинского оборудования.
"
          progress={100}
        />
      </SwiperSlide>
    </Swiper>
  </StyledList>
);

const StyledList = styled.div`
  .swiper-slide {
    margin-bottom: 97px;
    width: max-content !important;
    height: 380px !important ;
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
