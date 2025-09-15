"use client";

// import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import { Card } from "../Specifications/List/Card/Card";
import type { StaticImageData } from "next/image"
import cardBorder from "@/assets/img/specification-border.png"
import { Background } from "../Autonomy/Banner/Background";
import { useState } from "react";
import ProductImg from "@/assets/img/product.png";
import ProductBg from "@/assets/img/product-bg.png";
import ArrowUp from "@/assets/img/arrow-up.svg";

type ImgLike = string | StaticImageData;

const slidesData = [
    {
        title: "",
        subtitle: "",
        photo: ProductImg,
        slide: 1,
    },
    {
        title: "",
        subtitle: "",
        photo: ProductImg,
        slide: 2,
    },
    {
        title: "",
        subtitle: "",
        photo: ProductImg,
        slide: 3,
    },
    {
        title: "",
        subtitle: "",
        photo: ProductImg,
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
    "technical_info": [
        { "value": "Онлайн с двойной конвертацией", "title": "Тип" },
        { "value": "600 В⋅А / 5400 вт", "title": "Мощность" },
        { "value": "Чистая синусоида", "title": "Форма напряжения" },
        { "value": "7.5 Ач по 12 шт.", "title": "Батареи" },
        { "value": "> 99%", "title": "КПД" },
        { "value": "110-300 В", "title": "Входное напряжение" },
        { "value": "220/230/240 В", "title": "Выходное напряжение" },
        { "value": "Клеммная колодка (terminal block)", "title": "Подключение" }
    ],
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
    const router = useRouter();
    const [version, setVersion] = useState(`version-${product.variants[0].id}`);
    const [showDescription, setShowDescription] = useState(false);

    const separatedName = product.name.split(" ");
    const { t } = useTranslation("common");
    return (
        <>
            <Wrapper style={{ borderTopStyle: "solid", borderBottomStyle: "dashed" }} className="pt-[35px] main-wrapper flex gap-[20px] mb-[96px]! border-t border-b border-[#313131]!  customScreen:flex-col customScreen:gap-[0px]">
                <WrapperContent className="overflow-hidden flex flex-col gap-[20px] w-[60%] relative">
                    <Title className="text-[70px] font-bold">{separatedName.map((item, index) => index === separatedName.length - 1 ? null : <span key={item}>{item + " "}</span>)} <OutlineText className="text-[70px] font-bold">{separatedName[separatedName.length - 1]}</OutlineText></Title>
                    <p className="max-w-[700px] mb-[23px] text-[15px] leading-[24px] uppercase font-[500] text-[#FFFFFF]"><span className="text-[#4BC785]">{t("ProductItem.text1")}</span> {t("ProductItem.text2")}</p>
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
                            <img src={ProductBg.src} alt="product-bg" className="w-full h-full absolute top-0 left-0 z-[0]" />

                            <SwiperWrapper className="w-full h-full relative">
                                {slidesData.map((slide, index) => (
                                    <SwiperSlide key={index}>
                                        <CardWrapper className="w-[50%] h-full relative left-[25%] z-[3] relative">
                                            <Card
                                                title={slide.title}
                                                subtitle={slide.subtitle}
                                                slide={slide.slide}
                                                totalSlides={slidesData.length}
                                                photo={slide.photo}

                                            />
                                        </CardWrapper>
                                    </SwiperSlide>
                                ))}
                            </SwiperWrapper>
                        </Swiper>
                    </StyledList>
                </WrapperContent>
                <SecondInfo className="border-l border-dashed border-[#313131]! w-[40%] pl-[20px]">
                    <div className="flex flex-row justify-between mb-[7px]">
                        <CenterText className="text-[18px] font-light text-[#FFFFFFA8]">
                            {t("ProductItem.article")}: {product.id}
                        </CenterText>
                        <p className="text-[14px] font-light text-[#1DCF94]">
                            {product.variants[0].stock[0].quantity > 0 ? t("ProductItem.availability") : t("ProductItem.not_availability")}
                        </p>

                    </div>
                    <CenterText className="text-[30px] font-semibold leading-[50px] mb-[20px]">{formatPrice(Number(product.variants[0].price))} $</CenterText>
                    <BuyButton onClick={() => router.push("/thanks-for-order")} className="cursor-pointer hover:bg-[#4BC785] mb-[40px] max-w-[270px] w-[100%] h-[58px] border border-solid border-[#4BC785] bg-[transparent] border border-[#4BC785] text-[#ffffff] text-[15px] font-bold rounded-[61px]">{t("ProductItem.buy")}</BuyButton>
                    <div className="border-b border-dashed border-[#313131]! mb-[22px]"></div>
                    <CenterText className="text-[23px] uppercase font-semibold text-[#FFFFFF] mb-[20px]">{t("ProductItem.version")}</CenterText>
                    <div className="pb-[30px] border-b border-dashed border-[#313131]!">
                        {product.variants.map((item) => (
                            <WrapperVersion
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
                            </WrapperVersion>
                        ))}

                    </div>

                    <div className="pb-[30px] pt-[20px] border-b border-dashed border-[#313131]!">
                        <CenterText className="text-[23px] uppercase font-bold text-[#FFFFFF] mb-[20px]">{t("ProductItem.socket")}</CenterText>
                        <WrapperVersion
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
                        </WrapperVersion>
                    </div>
                    <div className="pb-[42px] relative" onClick={() => setShowDescription(!showDescription)}>

                        <DescriptionText className="flex items-center justify-between gap-[10px] relative text-[23px] leading-[33px] uppercase font-bold text-[#FFFFFF] mb-[18px] mt-[22px]">
                            {t("ProductItem.description")}
                            <ArrowUp className={`cursor-pointer w-[24px] h-[24px] transition-all duration-300 ${showDescription ? "rotate-0" : "rotate-180"}`}
                                aria-label="arrow-down" />
                        </DescriptionText>
                        <p
                            className={`text-[14px] leading-[18px] text-[#FFFFFFA8] transition-[max-height] duration-300 ease-in-out overflow-hidden ${showDescription ? "max-h-[200px] overflow-y-auto" : "max-h-0"
                                }`}
                        >
                            {product.description}
                            {product.description}
                            {product.description}
                        </p>
                    </div>


                </SecondInfo>
            </Wrapper>

            <div className="main-wrapper">
                <h2 className="text-[30px] !text-left font-bold text-[#FFFFFF] mb-[40px]">{t("ProductItem.technical_info.title")} </h2>
                <TechInfo className="h-[400px] grid grid-cols-2 gap-[10px] mb-[100px]">
                    {product.technical_info.map((item, index) => (
                        <div key={index} className="flex flex-row justify-between mb-[44px] w-full max-w-[100%]">
                            <StyledPrice className="w-[100%] block mr-[20px] text-[14px] pb-[15px] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]">{item.title}</StyledPrice>
                            <p className="w-[100%] pb-[15px] text-[#FFFFFFC9] relative inline-block text-[18px] leading[18px] font-bold">{item.value}
                                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-gray-300 to-transparent"></span>
                            </p>
                        </div>
                    ))}
                </TechInfo>
            </div>
        </>
    )
}


const StyledPrice = styled.p`
    @media (max-width: 764px) {
        border-bottom: none !important;
    }
`;

const TechInfo = styled.div`
    @media (max-width: 1000px) {
       grid-template-columns: 1fr;
       height: auto;
       mb-[40px];
    }
`;


const CenterText = styled.p`
    @media (max-width: 1000px) {
        text-align: center;
        font-size: 18px;
    }
`;

const DescriptionText = styled(CenterText)`
    @media (max-width: 1000px) {
        justify-content: center;
    }
`;

const BuyButton = styled.button`
    @media (max-width: 1000px) {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
        margin-bottom: 20px;
    }
`;

const Title = styled.div`
    @media (max-width: 1000px) {
        span {
            text-align: center;
            font-size: 30px;
            line-height: 35px;
            margin-bottom: 20px;
        }
        text-align: center;
        font-size: 30px;
        line-height: 35px;
        margin-bottom: 20px;
    }
`;

const SwiperWrapper = styled.div`
    @media (max-width: 1000px) {
        width: 100%;
    }
`;

const CardWrapper = styled.div`
    > div > :last-child {
        display: none;
    }
    @media (max-width: 1000px) {
        width: 100%;
        left: 0;
        background-size: contain;

         > div {
        background-size: contain;
        }
    }
`;

const Wrapper = styled.div`
    @media (max-width: 1000px) {
        flex-direction: column;
        gap: 0px;
        label {
            margin: auto;
            margin-bottom: 20px;
            width: 50%;
        }
    }
`;

const WrapperContent = styled.div`
    @media (max-width: 1000px) {
        width: 100%;
    }
`;

const SecondInfo = styled.div`
    @media (max-width: 1000px) {
        width: 100%;
        border-left: none;
        border-top: 1px dashed #313131;
        padding-top: 20px;
    }
`;

const WrapperVersion = styled.label`
    font-weight: 600;
    @media (max-width: 1000px) {
       justify-content: center;
    }
`;

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
