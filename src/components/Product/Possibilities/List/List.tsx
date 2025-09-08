"use client";

import styled from "styled-components"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Card } from "./Card/Card"

export const List = () => (
  <StyledList>
    <Swiper
      spaceBetween={20}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      breakpoints={{
        500: {
          slidesPerView: "auto",
          centeredSlides: true,
        },
        0: {
          slidesPerView: 1,
          centeredSlides: true,
        },
      }}
    >
      <SwiperSlide>
        <Card
          title="Подключение без адаптеров"
          subtitle="4 европейских розетки «Sсhuko» из качественного пластика. Идеальны для медицинского оборудования."
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
          subtitle="Позволяет отслеживать состояние ИБП и подключенного оборудования."
          progress={75}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          title="Горячая замена АКБ"
          subtitle="Для замены батарей не нужно отключать ИБП. Система продолжает работать."
          progress={100}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          title="Подключение без адаптеров"
          subtitle="4 европейских розетки «Sсhuko» из качественного пластика. Идеальны для медицинского оборудования."
          progress={100}
        />
      </SwiperSlide>
    </Swiper>
  </StyledList>
);

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
