"use client";

import { formatPrice } from "@/helpers/formatPrice";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Сross from "@/assets/img/cross.svg";
import Image from "next/image";

interface OrderInfoProps {
    orderInfo: {
        totalOrders: number;
        newOrders: number;
        totalSum: number;
        averageOrderPrice: number;
        date: string;
    };
}

export const OrderInfo = ({ orderInfo }: OrderInfoProps) => {
    const { t } = useTranslation("common");

    return (
        <Wrapper className="flex flex-row justify-between gap-[20px] mb-[30px] items-center">
            <Button className="flex flex-row items-center">
                <Сross className="w-[14px] h-[14px] mr-[10px]" />
                <p>{t("AdminDashboard.add_order")}</p>
            </Button>
            <div className="grid grid-cols-4 gap-[14px]">
                <WrapperInfo>
                    <ResultInfo>{formatPrice(orderInfo.totalOrders)} {t("AdminDashboard.currency")}</ResultInfo>
                    <p>{t("AdminDashboard.orders_count")} {orderInfo.date}</p>

                </WrapperInfo>
                <WrapperInfo>
                    <ResultInfo>{formatPrice(orderInfo.totalSum)} {t("AdminDashboard.currency")}</ResultInfo>
                    <p>{t("AdminDashboard.sold_sum")}</p>
                </WrapperInfo>
                <WrapperInfo>
                    <ResultInfo>{formatPrice(orderInfo.averageOrderPrice)} {t("AdminDashboard.currency")}</ResultInfo>
                    <p>{t("AdminDashboard.avr_order_price")}</p>
                </WrapperInfo>

                <WrapperInfo>
                    <ResultInfo>{formatPrice(orderInfo.newOrders)} {t("AdminDashboard.currency")}</ResultInfo>
                    <p>{t("AdminDashboard.new_orders")}</p>
                </WrapperInfo>

            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    @media (max-width: 1240px) {
        align-items: center;
        flex-direction: column;
        gap: 20px;
    }

    > div {
        @media (max-width: 1100px) {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 20px;
        }
        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }
`;

const ResultInfo = styled.p`
    font-size: 25px;
    line-height: 25px;
    letter-spacing: 1%;
    font-weight: 600;
    margin-bottom: 10px;
`

const WrapperInfo = styled.div`
    background-color: #191717;
    border-radius: 8px;
    padding: 14px 10px;

    >p:last-child {
        font-size: 12px;
        line-height: 16px;
        font-weight: 300;
    }
`;


const Button = styled.button`
    background-color: #535353;
    border-radius: 61px;
    position: relative;
    width: auto;
    font-size: 15px;
    font-weight: 600;
    line-height: 100%;
    text-align: center;
    color: #ffffff;
    padding: 16px 0 16px 10px;
    padding-left: 10px;

    p {
        display: block;
        width: 173px;
        text-align: center;
    }

    &::before {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 35px;
        width: 1px;
        height: 70%;
        background-color:rgba(255, 255, 255, 0.5);
    }
`;