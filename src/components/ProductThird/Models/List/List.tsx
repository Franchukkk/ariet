"use client";

import photo from "@/assets/img/module.png"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { ModelCard } from "../../../ModelCard/ModelCard"

export const List = () => {
  const { t } = useTranslation("common");

  const MODELS = [
    { title: t("models.ups_title"), category: t("models.single_phase"), link: "/" },
    { title: t("models.ups_title"), category: t("models.single_phase"), link: "/", isNew: true },
    { title: t("models.ups_title"), category: t("models.single_phase"), link: "/" },
    { title: t("models.ups_title"), category: t("models.single_phase"), link: "/" },
    { title: t("models.ups_title"), category: t("models.single_phase"), link: "/" },
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
};

const StyledList = styled.div`
  border-top: 1px dashed #ffffff50;
  padding: 12px 0 14px;
`;
