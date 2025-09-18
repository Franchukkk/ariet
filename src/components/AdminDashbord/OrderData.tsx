"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import ArrowDown from "@/assets/img/arrow-up.svg";
import Glass from "@/assets/img/glass.svg";
import edit from "@/assets/img/edit.png";
// import { fakeData } from "./fakeData";
import { OrderCard } from "./OrderCard";
import { ModalCart } from "./ModalCart";

type StatusCounts = {
    delivered: number;
    paid: number;
    draft: number;
    sent: number;
};

const countStatuses = (data: any[]): StatusCounts => {
    const counted: StatusCounts = {
        delivered: 0,
        paid: 0,
        draft: 0,
        sent: 0,
    }
    data.forEach(item => {
        if (item.status === "Доставлено" || item.status === "Delivered") {
            counted.delivered++;
        } else if (item.status === "Оплачено" || item.status === "Paid") {
            counted.paid++;
        } else if (item.status === "Отправлен" || item.status === "Sent") {
            counted.sent++;
        } else if (item.status === "Черновик" || item.status === "Draft") {
            counted.draft++;
        }
    })
    return counted;
}

const sortOfStatuses = (data: any[]) => {
    const orders: Record<string, any[]> = {
        delivered: [],
        paid: [],
        draft: [],
        sent: [],
    }
    data.forEach((item: any, index: number) => {
        if (item.status === "Доставлено" || item.status === "Delivered") {
            orders["delivered"].push(item);
        } else if (item.status === "Оплачено" || item.status === "Paid") {
            orders["paid"].push(item);
        } else if (item.status === "Черновик" || item.status === "Draft") {
            orders["draft"].push(item);
        } else if (item.status === "Отправлен" || item.status === "Sent") {
            orders["sent"].push(item);
        }
    })
    return orders;
}

export const OrderData = () => {
    const [orders, setOrders] = useState<any[]>([])
    const [selectValue, setSelectValue] = useState<string>("Дефолт");
    const [countStatusesValue, setCountStatusesValue] = useState<StatusCounts>(countStatuses(orders));
    const [sortOfStatusesValue, setSortOfStatusesValue] = useState<Record<string, any[]>>(sortOfStatuses(orders));
    const [selectOrder, setSelectOrder] = useState<boolean | any>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [refreshOrders, setRefreshOrders] = useState<boolean>(false);

    const { t } = useTranslation("common");

    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        setIsLoading(true);
        setRefreshOrders(false)

        fetch("https://rpktask.sytes.net/api/orders/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        })
            .then(response => response.json())
            .then(data => setOrders(data.results))
            .catch(err => console.log(err))
            .finally(() => setIsLoading(false));


    }, [refreshOrders])


    const handleClick = () => {
        selectRef.current?.click();
    }

    const handleDeleteOrder = async () => {
        const cancelOrder = await fetch(`https://rpktask.sytes.net/api/orders/${selectOrder.id}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        })

        setRefreshOrders(true)
    }

    const handleChangeStatus = () => {
        const updatedOrders = orders.map((item: any) => item.id === selectOrder.id ? { ...item, status: "Доставлено" } : item);
        setOrders(updatedOrders);
        setCountStatusesValue(countStatuses(updatedOrders));
        setSortOfStatusesValue(sortOfStatuses(updatedOrders));
    }

    const handerSortByDate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectValue(e.target.value);
        const search = searchValue.length > 0 ? orders.filter((item) => item.id.toString().includes(searchValue)) : orders;
        const sort = e.target.value === "Сортировать по дате" ? search.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : search;
        setCountStatusesValue(countStatuses(sort));
        setSortOfStatusesValue(sortOfStatuses(sort));
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setSortOfStatusesValue(sortOfStatuses(orders.filter((item) => item.id.toString().includes(e.target.value))));
        setCountStatusesValue(countStatuses(orders.filter((item) => item.id.toString().includes(e.target.value))));

    }

    const handlerCardClick = (item: any, e: React.MouseEvent): void => {
        if (e.target instanceof SVGElement) {
            setIsOpen(!isOpen);
        }

        setSelectOrder(selectOrder === item.id ? false : item)
    }

    return (
        <div className="flex flex-col justify-between">
            <Filters className="flex flex-row justify-between w-full gap-[10px] items-center mb-[30px]">
                <div>
                    <button className="cursor-pointer flex items-center gap-[10px] mb-[-25px]" onClick={handleClick}>
                        <p>{t("AdminDashboard.sort")}</p>
                        <ArrowDown className="rotate-180" />
                    </button>
                    <select ref={selectRef} className="cursor-pointer h-[30px] opacity-0 mt-[-50px] w-[130px]" value={selectValue} onChange={handerSortByDate}>
                        <option value="">{t("AdminDashboard.sort")}</option>
                        <option value="Сортировать по дате">{t("AdminDashboard.sort_by_date")}</option>
                        <option value="Другое">{t("AdminDashboard.sort_by_enoth")}</option>
                    </select>
                </div>
                <Find className="flex-1 flex flex-row justify-center relative">

                    <label className="relative max-w-[540px] w-full flex-1">
                        <Glass className="absolute right-[20px] top-[50%] transform -translate-y-1/2" />
                        <input className="border border-[#333333] rounded-[61px] pr-[22px] pl-[40px] max-w-[540px] w-full h-[50px] bg-[transparent] outline-none" type="text" placeholder={t("AdminDashboard.search")} value={searchValue} onChange={handleSearch} />
                    </label>
                </Find>
                <ResultFilter className="text-right text-center text-[#4BC785] font-[500] text-[15px]">{selectValue}</ResultFilter>
            </Filters>
            <div className="overflow-x-auto pt-[7px]">
                <Lists className="w-[988px] inline-grid grid-cols-4 gap-[20px] mb-[30px]">
                    <div className="flex flex-col gap-[20px] w-[235px]">
                        <StatusWrapper className="flex flex-row justify-between items-center" $status="delivered">
                            <img className="absolute top-[-10px] left-[-5px]" src={edit.src} width={30} height={30} alt="edit" />
                            <p>{t("AdminDashboard.statuses.delivered")}</p>
                            <CountStatus>{countStatusesValue.delivered}</CountStatus>
                        </StatusWrapper>
                        <ul className="flex flex-col gap-[10px] overflow-y-auto max-h-[480px]">
                            {sortOfStatusesValue.delivered.map((item) => {
                                return <OrderCard key={item.id} item={item} onClick={(e) => handlerCardClick(item, e)} select={selectOrder.id} />
                            })}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-[20px] w-[235px]">
                        <StatusWrapper className="flex flex-row justify-between items-center" $status="paid">
                            <img className="absolute top-[-10px] left-[-5px]" src={edit.src} width={30} height={30} alt="edit" />
                            <p>{t("AdminDashboard.statuses.paid")}</p>
                            <CountStatus>{countStatusesValue.paid}</CountStatus>
                        </StatusWrapper>
                        <ul className="flex flex-col gap-[10px] overflow-y-auto max-h-[480px]">
                            {sortOfStatusesValue.paid.map((item) => {
                                return <OrderCard key={item.id} item={item} onClick={(e) => handlerCardClick(item, e)} select={selectOrder.id} />
                            })}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-[20px] w-[235px]">
                        <StatusWrapper className="flex flex-row justify-between items-center" $status="draft">
                            <img className="absolute top-[-10px] left-[-5px]" src={edit.src} width={30} height={30} alt="edit" />
                            <p>{t("AdminDashboard.statuses.draft")}</p>
                            <CountStatus>{countStatusesValue.draft}</CountStatus>
                        </StatusWrapper>
                        <ul className="flex flex-col gap-[10px] overflow-y-auto max-h-[480px]">
                            {sortOfStatusesValue.draft.map((item) => {
                                return <OrderCard key={item.id} item={item} onClick={(e) => handlerCardClick(item, e)} select={selectOrder.id} />
                            })}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-[20px] w-[235px]">
                        <StatusWrapper className="flex flex-row justify-between items-center" $status="sent">
                            <img className="absolute top-[-10px] left-[-5px]" src={edit.src} width={30} height={30} alt="edit" />
                            <p>{t("AdminDashboard.statuses.sent")}</p>
                            <CountStatus>{countStatusesValue.sent}</CountStatus>
                        </StatusWrapper>
                        <ul className="flex flex-col gap-[10px] overflow-y-auto max-h-[480px]">
                            {sortOfStatusesValue.sent.map((item) => {
                                return <OrderCard key={item.id} item={item} onClick={(e) => handlerCardClick(item, e)} select={selectOrder.id} />
                            })}
                        </ul>
                    </div>

                </Lists >
            </div>
            <BottomSet className="flex flex-row justify-end gap-[10px]">
                <button onClick={handleChangeStatus} className="rounded-full w-[206px] h-[50px] bg-[#transparent] text-[#ffffff] font-[500] text-[15px] rounded-[10px] border border-[#1DCF94] cursor-pointer text-center text-[15px] leading-[15px] fonnt-[600]">{t("AdminDashboard.change_status")}</button>
                <button onClick={handleDeleteOrder} className="rounded-full w-[206px] h-[50px] bg-[#transparent] text-[#ffffff] font-[500] text-[15px] rounded-[10px] border border-[#1DCF94] cursor-pointer text-center text-[15px] leading-[15px] fonnt-[600]">{t("AdminDashboard.delete")}</button>
            </BottomSet>

            {isOpen && <ModalCart setIsOpen={setIsOpen} item={selectOrder as any} />}
        </div >
    )
}


const Filters = styled.div`

    @media (max-width: 800px) {
        flex-direction: column;
    }
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
