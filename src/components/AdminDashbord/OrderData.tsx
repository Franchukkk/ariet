"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import ArrowDown from "@/assets/img/arrow-up.svg";
import Glass from "@/assets/img/glass.svg";
import edit from "@/assets/img/edit.png";
import { fakeData } from "./fakeData";

const fakeDataList = fakeData;

type StatusCounts = {
    delivered: number;
    paid: number;
    draft: number;
    sent: number;
};

const countStatuses = (data: object): StatusCounts => {
    const counted: StatusCounts = {
        delivered: 0,
        paid: 0,
        draft: 0,
        sent: 0,
    }
    fakeDataList.forEach(item => {
        if (item.status === "Доставлено") {
            counted.delivered++;
        } else if (item.status === "Оплачено") {
            counted.paid++;
        } else if (item.status === "Отправлен") {
            counted.sent++;
        } else if (item.status === "Черновик") {
            counted.draft++;
        }
    })
    return counted;
}

const sortOfStatuses = (data: object) => {
    const orders: Record<string, any[]> = {
        delivered: [],
        paid: [],
        draft: [],
        sent: [],
    }
    fakeDataList.forEach(item => {
        if (orders[item.status]) {
            orders[item.status].push(item);
        }
    })
    return orders;
}

export const OrderData = () => {
    const [selectValue, setSelectValue] = useState<string>("Дефолт");
    const [countStatusesValue, setCountStatusesValue] = useState<StatusCounts>(countStatuses(fakeDataList));
    const [sortOfStatusesValue, setSortOfStatusesValue] = useState<Record<string, any[]>>(sortOfStatuses(fakeDataList));


    const { t } = useTranslation("common");

    const selectRef = useRef<HTMLSelectElement>(null);

    const handleClick = () => {
        selectRef.current?.click();
    }

    return (
        <Wrapper className="flex flex-col justify-between">
            <Filters className="flex flex-row justify-between w-full gap-[10px] items-center mb-[30px]">
                <div>
                    <button className="cursor-pointer flex items-center gap-[10px] mb-[-25px]" onClick={handleClick}>
                        <p>{t("AdminDashboard.sort")}</p>
                        <ArrowDown className="rotate-180" />
                    </button>
                    <select ref={selectRef} className="cursor-pointer h-[30px] opacity-0 mt-[-50px] w-[130px]" value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                        <option value="">{t("AdminDashboard.sort")}</option>
                        <option value="Сортировать по дате">{t("AdminDashboard.sort_by_date")}</option>
                        <option value="Другое">{t("AdminDashboard.sort_by_enoth")}</option>
                    </select>
                </div>
                <Find className="flex-1 flex flex-row justify-center relative">

                    <label className="relative max-w-[540px] w-full flex-1">
                        <Glass className="absolute right-[20px] top-[50%] transform -translate-y-1/2" />
                        <input className="border border-[#333333] rounded-[61px] pr-[22px] pl-[40px] max-w-[540px] w-full h-[50px] bg-[transparent] outline-none" type="text" placeholder={t("AdminDashboard.search")} />
                    </label>
                </Find>
                <ResultFilter className="text-right w-[160px] text-center text-[#4BC785] font-[500] text-[15px]">{selectValue}</ResultFilter>
            </Filters>
            <Lists className="grid grid-cols-4 gap-[20px]">
                <StatusWrapper className="flex flex-row justify-between items-center" $status="delivered">
                    <img className="absolute top-[-10px] left-[-5px]" src={edit.src} width={30} height={30} alt="edit" />
                    <p>{t("AdminDashboard.statuses.delivered")}</p>
                    <CountStatus>{countStatusesValue.delivered}</CountStatus>
                </StatusWrapper>
                <StatusWrapper className="flex flex-row justify-between items-center" $status="paid">
                    <img className="absolute top-[-10px] left-[-5px]" src={edit.src} width={30} height={30} alt="edit" />
                    <p>{t("AdminDashboard.statuses.paid")}</p>
                    <CountStatus>{countStatusesValue.paid}</CountStatus>
                </StatusWrapper>
                <StatusWrapper className="flex flex-row justify-between items-center" $status="draft">
                    <img className="absolute top-[-10px] left-[-5px]" src={edit.src} width={30} height={30} alt="edit" />
                    <p>{t("AdminDashboard.statuses.draft")}</p>
                    <CountStatus>{countStatusesValue.draft}</CountStatus>
                </StatusWrapper>
                <StatusWrapper className="flex flex-row justify-between items-center" $status="sent">
                    <img className="absolute top-[-10px] left-[-5px]" src={edit.src} width={30} height={30} alt="edit" />
                    <p>{t("AdminDashboard.statuses.sent")}</p>
                    <CountStatus>{countStatusesValue.sent}</CountStatus>
                </StatusWrapper>
            </Lists>

            <BottomSet>

            </BottomSet>
        </Wrapper >
    )
}

const Wrapper = styled.div`

`;

const Filters = styled.div`

`;

const Lists = styled.div`

`;

const BottomSet = styled.div`

`;

const Find = styled.div`

`;

const ResultFilter = styled.p`

`;

const StatusWrapper = styled.div<{ $status: string }>`
    font-size: 20px;
    font-weight: 600;
    position: relative;
    padding-left: 40px;
    border-radius: 10px;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-right: 10px;
    background-color: ${({ $status }) => $status === "delivered" ? "#4BC785" : $status === "paid" ? "#1DA1E3" : $status === "draft" ? "#686868" : "#D56909"};
`;

const CountStatus = styled.p`
    font-size: 13px;
    line-height: 100%;
    font-weight: 400;
    color: #ffffff;
    width: 29px;
    height: 29px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    background-color: #00000040;
    box-shadow: 0px 4px 4px 0px #00000040 inset;

`;