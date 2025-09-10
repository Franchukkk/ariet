"use client";

// import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import { Card } from "../Specifications/List/Card/Card";
import type { StaticImageData } from "next/image"
import cardBorder from "@/assets/img/specification-border.png"
import { Background } from "../Autonomy/Banner/Background";
import { useState } from "react";

type ImgLike = string | StaticImageData;

const slidesData = [
    {
        title: "",
        subtitle: "",
        photo: "/image/product.png",
        slide: 1,
    },
    {
        title: "",
        subtitle: "",
        photo: "/image/product.png",
        slide: 2,
    },
    {
        title: "",
        subtitle: "",
        photo: "/image/product.png",
        slide: 3,
    },
    {
        title: "",
        subtitle: "",
        photo: "/image/product.png",
        slide: 4,
    },
];

const product = {
    "id": 0,
    "name": "Онлайн ИБП Ariet T3K",
    "description": `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. 
    In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. 
    Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. `,
    "sku": "sku",
    "category": {
        "id": 0,
        "name": "category"
    },
    "variants": [
        {
            "id": 0,
            "sku": "categoti 1",
            "socket": {
                "code": "C13",
                "name": "EU"
            },
            "images": [
                {
                    "image": "/img/product.jpg",
                    "alt_text": "product"
                }
            ],
            "stock": [
                {
                    "warehouse": {
                        "id": 0,
                        "name": "name",
                        "location": "location"
                    },
                    "quantity": 2147483647
                }
            ],
            "price": "12323",
            "dealer_price": "471677",
            "min_retail_price": "-196",
            "recommended_price": "-.62",
            "project_price": "4"
        }, {
            "id": 1,
            "sku": "categoti 1",
            "socket": {
                "code": "C13",
                "name": "EU"
            },
            "images": [
                {
                    "image": "/img/product.jpg",
                    "alt_text": "product"
                }
            ],
            "stock": [
                {
                    "warehouse": {
                        "id": 1,
                        "name": "name",
                        "location": "location"
                    },
                    "quantity": 2147483647
                }
            ],
            "price": "12323",
            "dealer_price": "471677",
            "min_retail_price": "-196",
            "recommended_price": "-.62",
            "project_price": "4"
        }, {
            "id": 2,
            "sku": "categoti 1",
            "socket": {
                "code": "C13",
                "name": "EU"
            },
            "images": [
                {
                    "image": "/img/product.jpg",
                    "alt_text": "product"
                }
            ],
            "stock": [
                {
                    "warehouse": {
                        "id": 2,
                        "name": "name",
                        "location": "location"
                    },
                    "quantity": 2147483647
                }
            ],
            "price": "12323",
            "dealer_price": "471677",
            "min_retail_price": "-196",
            "recommended_price": "-.62",
            "project_price": "4"
        }
    ]
};

function formatPrice(num: number) {
    return Number(num).toLocaleString('en-US').replace(',', ' ');
}

export const ProductInformation = () => {
    const [version, setVersion] = useState(`version-${product.variants[0].id}`);
    const [showDescription, setShowDescription] = useState(false);
    // const params = useParams();
    // const id = params.id;

    const separatedName = product.name.split(" ");
    const { t } = useTranslation("common");
    return (
        <div style={{ borderTopStyle: "solid", borderBottomStyle: "dashed" }} className="pt-[35px] main-wrapper flex gap-[20px] mb-[96px]! border-t border-b border-[#313131]!  customScreen:flex-col customScreen:gap-[0px]">
            <div className="overflow-hidden flex flex-col gap-[20px] w-[60%] relative ">
                <div className="text-[70px] font-bold">{separatedName.map((item, index) => index === separatedName.length - 1 ? null : <span key={item}>{item + " "}</span>)} <OutlineText className="text-[70px] font-bold">{separatedName[separatedName.length - 1]}</OutlineText></div>
                <StyledList $cardBorder={cardBorder} className="overflow-hidden">
                    <Swiper
                        spaceBetween={25}
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            1024: { slidesPerView: 1 },
                            1200: { slidesPerView: 1 }
                        }}
                    >
                        <CanvasBlockOne>
                            <Background />
                        </CanvasBlockOne>
                        <CanvasBlockTwo>
                            <Background />
                        </CanvasBlockTwo>
                        <img src="/image/product-bg.png" alt="product-bg" className="w-full h-full absolute top-0 left-0 z-[0]" />

                        <div className="w-full h-full relative">
                            {slidesData.map((slide, index) => (
                                <SwiperSlide key={index}>
                                    <div className="w-[50%] h-full relative left-[25%] z-[3] relative">
                                        <Card
                                            title={slide.title}
                                            subtitle={slide.subtitle}
                                            slide={slide.slide}
                                            totalSlides={slidesData.length}
                                            photo={slide.photo}

                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </div>
                    </Swiper>
                </StyledList>
            </div>
            <div className="border-l border-dashed border-[#313131]! w-[40%] pl-[20px]">
                <div className="flex flex-row justify-between mb-[7px]">
                    <p className="text-[18px] font-light text-[#FFFFFFA8]">
                        {t("ProductItem.article")}: {product.id}
                    </p>
                    <p className="text-[14px] font-light text-[#1DCF94]">
                        {product.variants[0].stock[0].quantity > 0 ? t("ProductItem.availability") : t("ProductItem.not_availability")}
                    </p>

                </div>
                <p className="text-[30px] font-semibold leading-[50px] mb-[20px]">{formatPrice(Number(product.variants[0].price))} $</p>
                <button className="mb-[40px] max-w-[270px] w-[100%] h-[58px] border border-solid border-[#4BC785] bg-[transparent] border border-[#4BC785] text-[#ffffff] text-[15px] font-bold rounded-[61px]">{t("ProductItem.buy")}</button>
                <div className="border-b border-dashed border-[#313131]! mb-[22px]"></div>
                <p className="text-[23px] uppercase font-semibold text-[#FFFFFF] mb-[20px]">{t("ProductItem.version")}</p>
                <div className="pb-[30px] border-b border-dashed border-[#313131]!">
                    {product.variants.map((item) => (
                        <label
                            key={`version-${item.id}`}
                            className={`flex items-center gap-[10px] pl-[25px] relative bg-[#0D0C0C] rounded-[8px] p-[10px] mb-[10px] cursor-pointer`}
                            style={{ color: version === `version-${item.id}` ? "#4BC785" : "#FFFFFF" }}
                        >
                            <input
                                type="radio"
                                id={`version-${item.id}`}
                                value={`version-${item.id}`}
                                name="version"
                                className="accent-[#E1E1E1] appearance-none w-[20px] h-[20px] rounded-full border border-[10px] border-[#FFFFFFC4] checked:bg-[#4BC785] checked:border-[#ffffff] checked:border-[3px]"
                                checked={version === `version-${item.id}`}
                                onChange={(e) => setVersion(e.target.value)}
                            />
                            {item.socket.name}
                        </label>
                    ))}

                </div>

                <div className="pb-[30px] pt-[20px] border-b border-dashed border-[#313131]!">
                    <p className="text-[23px] uppercase font-bold text-[#FFFFFF] mb-[20px]">{t("ProductItem.socket")}</p>
                    <label

                        className={`flex items-center gap-[10px] pl-[25px] relative bg-[#0D0C0C] rounded-[8px] p-[10px] mb-[10px] cursor-pointer`}
                    >
                        <input
                            type="radio"
                            checked
                            readOnly
                            name="socket"
                            className="accent-[#E1E1E1] appearance-none w-[20px] h-[20px] rounded-full border border-[10px] border-[#FFFFFFC4] checked:bg-[#4BC785] checked:border-[#ffffff] checked:border-[3px]"
                        />
                        {product.variants[Number(version.split("-")[1])].socket.code}
                    </label>
                </div>
                <div className="pb-[42px] relative" onClick={() => setShowDescription(!showDescription)}>
                    <img className={`absolute top-[10px] left-[350px] w-[24px] h-[24px] transition-all duration-300 ${showDescription ? "rotate-0" : "rotate-180"}`}
                        src="/image/arrow-up.svg" alt="arrow-down" />
                    <p className="text-[23px] leading-[33px] uppercase font-bold text-[#FFFFFF] mb-[18px] mt-[22px]">{t("ProductItem.description")}</p>
                    <p
                        className={`text-[14px] leading-[18px] text-[#FFFFFFA8] transition-[max-height] duration-300 ease-in-out overflow-hidden ${showDescription ? "max-h-[200px] overflow-y-auto" : "max-h-0"
                            }`}
                    >
                        {product.description}
                        {product.description}
                        {product.description}
                    </p>
                </div>


            </div>
        </div>
    )
}




const OutlineText = styled.span`
            font-weight: bold;
            color: transparent; /* заливка прозора */
            -webkit-text-stroke-width: 1px; /* товщина обводки */
            -webkit-text-stroke-color: #ffffff; /* колір обводки */
            `;


const StyledList = styled.div<{ $cardBorder: ImgLike }>`
    .swiper-slide {
    margin - bottom: 84px;
    position: relative;
    background: ${({ $cardBorder }) =>
        `url(${typeof $cardBorder === "string" ? $cardBorder : $cardBorder.src}) center/cover no-repeat`};
    }

    .swiper-slide {
    background: none !important;
    }

    @media (max-width: 1000px) {
        .swiper - slide {
        margin - bottom: 34px;
        }
    }
`;

const CanvasBlockOne = styled.div`
    transform: rotate(-45deg);
    position: absolute;
    right: -200px;
    top: -360px;
    width: 1240px;
    height: 1199px;
    z-index: -2;
    overflow: hidden;
`;

const CanvasBlockTwo = styled(CanvasBlockOne)`
    transform: rotate(45deg);
`;
