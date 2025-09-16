"use client";

import Cross from "@/assets/img/close.svg";
import { useTranslation } from "react-i18next";
import Eye from "@/assets/img/eye.svg";
import Pencil from "@/assets/img/pencil.svg";
import Notebook from "@/assets/img/notebook.svg";
import { formatDate } from "@/helpers/formatDate";
import styled from "styled-components";

export const ModalCart = ({ item, setIsOpen }: { item: any, setIsOpen: (isOpen: boolean) => void }) => {

    const { t, i18n } = useTranslation("common");

    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains("wraper")) {
            setIsOpen(false);
        }
    }

    if (!item) return null;

    return (
        <div onClick={(e) => handleClose(e)} className="w-full h-full pt-[5%] px-[20px] fixed top-0 left-0 bg-[#00000080] z-[100] wraper">
            <Wrapper className="relative pb-[47px] pt-[20px] pl-[0px] pr-[129px] w-full max-w-[888px] bg-[#292929] m-auto rounded-[10px]">
                <Cross className="cursor-pointer absolute w-[24px] h-[24px] top-[20px] right-[20px]" onClick={() => setIsOpen(false)} />
                <WrapperOrder className="relative mb-[30px] flex flex-row justify-between" >
                    <div className="relative pl-[59px]">
                        <p className="mb-[11px] font-[400] leading-[18px] text-[18px] text-[#ffffff]">{t("AdminDashboard.order_id")} {item.id}</p>
                        <p className="mb-[10px] font-[400] leading-[16px] text-[16px] text-[#7F7F7F]">{formatDate(item.date, i18n.language)}</p>
                        <p className="mb-[10px] font-[600] leading-[17px] text-[17px] text-[#ffffff]">{item.status}</p>
                    </div>
                    <IconWrapper className="flex flex-row gap-[50px] items-start">
                        <div className="flex flex-row flex-row gap-[10px] items-center">
                            <Eye className="w-[24px] h-[24px]" />
                            <p className="font-[400] leading-[16px] text-[16px] text-[#7F7F7F]">15</p>
                        </div>
                        <Pencil className="w-[24px] h-[24px]" />
                        <Notebook className="w-[24px] h-[24px]" />
                    </IconWrapper>
                </WrapperOrder>
                <div className="mb-[40px] flex flex-row flex-wrap gap-[10px] pl-[20px] pr-[20px]">
                    {item.products.map((element: any, index: number) => {
                        return (
                            <div key={index} className="flex flex-row gap-[10px] w-[45%] min-w-[300px]">
                                <div className="flex items-center justify-center rounded-[8px] bg-[#0D0C0C] w-[94px] h-[92px]">
                                    <img width={74} src={element.photo.src} alt={element.name} />
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <p className="mb-[11px] font-[400] leading-[13px] text-[13px] text-[#7F7F7F]">Однофазние ИПБ</p>
                                    <p className="mb-[11px] font-[600] leading-[17px] text-[17px] text-[#ffffff]">{element.name}</p>
                                    <div className="flex flex-row gap-[10px] justify-between">
                                        <p className="font-[400] leading-[17px] text-[17px] text-[#ffffff]">{element.quantity}x</p>
                                        <p className="font-[600] leading-[17px] text-[17px] text-[#ffffff]">{element.price * element.quantity} {t("AdminDashboard.currency")}</p>
                                    </div>
                                </div>
                            </div>


                        )
                    })}
                </div>
                <div className="pl-[20px]">
                    <p className="text-[16px] mb-[10px] leading-[18px] text-[#FFFFFFC9]">{item.name}</p>
                    <p className="text-[16px] mb-[10px] leading-[18px] text-[#FFFFFFC9]">{t("AdminDashboard.tel")} {item.tel}</p>
                    <p className="text-[16px] mb-[10px] leading-[18px] text-[#FFFFFFC9]">{t("AdminDashboard.email")} {item.email}</p>
                    <p className="text-[16px] mb-[10px] leading-[18px] text-[#FFFFFFC9]">{item.address}</p>
                </div>
            </Wrapper>

        </div>
    )
}

const WrapperOrder = styled.div`
relative;
   &::before {
    content: "";
    position: absolute;
    left: 20px;
    top: 0px;
    width: 20px;
    height: 20px;
    background-color: #979797;
    border: 1px solid #434343;
    border-radius: 4px;
   }

    &::after {
    content: "";
    position: absolute;
    left: 20px;
    bottom: -10px;
    width: calc(100% + 90px);
    height: 1px;
    background-color: #ffffff42;
   }
`;

const Wrapper = styled.div`

    @media (max-width: 764px) {
        padding-top: 60px;
        heigth: 100%;
        max-height: 90%;
        overflow-y: auto;
    }
`;

const IconWrapper = styled.div`
    @media (max-width: 764px) {
        gap: 10px;
    }
`;