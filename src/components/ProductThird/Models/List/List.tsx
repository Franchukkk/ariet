"use client";

import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css/pagination";
import photo from "@/assets/img/module.png";
import { ModelCard } from "../../../ModelCard/ModelCard";

const MODELS = [
  { title: "Онлайн ИБП ARIET", category: "Однофазные ИБП", link: "/" },
  { title: "Онлайн ИБП ARIET", category: "Однофазные ИБП", link: "/", isNew: true },
  { title: "Онлайн ИБП ARIET", category: "Однофазные ИБП", link: "/" },
  { title: "Онлайн ИБП ARIET", category: "Однофазные ИБП", link: "/" },
  { title: "Онлайн ИБП ARIET", category: "Однофазные ИБП", link: "/" },
];

export const List = () => (
  <StyledList>
    <Swiper
      spaceBetween={0}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 2000,
        disableOnInteraction: true,
      }}
      loop={true}
      pagination={{ clickable: true }}
      breakpoints={{
        1024: { slidesPerView: 3 },
        800: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      }}
    >
      {MODELS.map((model, i) => (
        <SwiperSlide key={i}>
          <ModelCard
            photo={photo}
            title={model.title}
            category={model.category}
            link={model.link}
            isNew={model.isNew}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </StyledList>
);

const StyledList = styled.div`
  border-top
