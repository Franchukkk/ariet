"use client";

import bg from "@/assets/img/home-bg-1.png"
import { useRef, useState } from "react"
import styled from "styled-components"
import type { Swiper as SwiperType } from "swiper"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Card } from "./Card/Card"
import { Footer } from "./Footer"
import { Navigations } from "./Navigations"
import { Slides } from "./Slides"

const SLIDES = [
  { title: "Inverter", photo: bg },
  { title: "UPS", photo: bg },
  { title: "Voltage Regulator", photo: bg },
  { title: "MDC", photo: bg },
  { title: "Batteries", photo: bg },
];

export const Banner = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleNavigation = (isNext?: boolean) => {
    if (swiperRef.current) {
      isNext ? swiperRef.current.slideNext() : swiperRef.current.slidePrev();
      setActiveSlide(swiperRef.current.activeIndex);
    }
  };

  const handleNavigateToSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
      setActiveSlide(swiperRef.current.activeIndex);
    }
  };

  return (
    <StyledBanner className="main-wrapper">
      <div className="relative">
        <Slides
          slides={SLIDES.map((s) => s.title)}
          active={activeSlide}
          onNavigate={handleNavigateToSlide}
        />
        <Navigations onNavigate={handleNavigation} />
        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          loop={false}
          navigation={false}
          onBeforeInit={(swiper: SwiperType) => {
            swiperRef.current = swiper;
          }}
        >
          {SLIDES.map(({ title, photo }, i) => (
            <SwiperSlide key={i}>
              <Card title={title} photo={photo} />
            </SwiperSlide>
          ))}
        </Swiper>{" "}
        <Footer
          active={activeSlide}
          total={SLIDES.length}
          nextSlide={
            SLIDES[activeSlide === SLIDES.length - 1 ? 0 : 1 + activeSlide]
              ?.title
          }
        />  
      </div>
    </StyledBanner>
  );
};

const StyledBanner = styled.div`
  position: relative;
  margin-bottom: 120px;
  .navigation-btns {
    position: absolute;
    top: 50%;
    right: 28px;
    left: 0;
    transform: translateY(-50%);
    z-index: 3;
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 43px;
      height: 43px;
      border: 1px dashed #ffffff80;
      border-radius: 4px;
      path {
        transition: all 0.3s;
      }
      &.next {
        svg {
          transform: rotate(180deg);
        }
      }
      &:hover {
        background: #4bc785;
        border: 1px solid #4bc785;
        path {
          fill: #000;
        }
      }
    }
  }
  @media (max-width: 1000px) {
    margin-bottom: 40px;
  }
`;
