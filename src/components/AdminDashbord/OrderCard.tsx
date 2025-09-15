"use client";

import { formatDate } from "@/helpers/formatDate";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import ArrowUp from "@/assets/img/arrow-up.svg"

interface OrderCardProps {
    item: any;
    onClick?: (e: React.MouseEvent) => void;
    select?: boolean | number;
}

export const OrderCard = ({ item, onClick, select }: OrderCardProps) => {

    const { t, i18n } = useTranslation("common");

    return (
        <WrapperCard $status={item.status} $selectProp={select === item.id} className="transition-all duration-300 cursor-pointer w-full border border-dashed border-[#FFFFFF80] pl-[21px] pt-[13px] px-[11px] relative" onClick={onClick}>
            <p className="text-[13px] text-[#7F7F7F] font-[400] mb-[10px] leading-[13px]" >{t("AdminDashboard.order_id")} {item.id}</p>
            <p className="text-[13px] text-[#7F7F7F] font-[400] mb-[10px] leading-[13px]" >{formatDate(item.date, i18n.language)}</p>
            <p className="text-[16px] text-[#ffffff] font-[600] mb-[10px] leading-[16px]" >{item.status}</p>
            < ArrowUp className="absolute top-[11px] right-[10px] fill-[#7F7F7F] rotate-180 z-[2]" />
        </WrapperCard>
    )
}

const WrapperCard = styled.li<{ $status: string, $selectProp?: boolean }>`
    background-color: ${({ $selectProp, $status }) => $selectProp ? $status === "Доставлено" || $status === "Delivered" ? "#4BC78529" : $status === "Оплачено" || $status === "Paid" ? "#1DA1E329" : $status === "Черновик" || $status === "Draft" ? "#68686829" : "#D5690929" : "transparent"};

    &:before {
        content: "";
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        width: 3px;
        height: 80%;
        background-color: ${({ $status }) => $status === "Доставлено" || $status === "Delivered" ? "#4BC785" : $status === "Оплачено" || $status === "Paid" ? "#1DA1E3" : $status === "Черновик" || $status === "Draft" ? "#686868" : "#D56909"};
    }
   `;