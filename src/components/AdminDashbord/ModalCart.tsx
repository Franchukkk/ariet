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

    console.log("item", item);
    return (
        <div onClick={(e) => handleClose(e)} className="w-full h-full pt-[5%] px-[20px] fixed top-0 left-0 bg-[#00000080] z-[100] wraper">
            <div className="relative pb-[47px] pt-[20px] pl-[0px] pr-[129px] w-full max-w-[888px] bg-[#292929] m-auto rounded-[10px]">
                <Cross className="cursor-pointer absolute w-[24px] h-[24px] top-[20px] right-[20px]" onClick={() => setIsOpen(false)} />
                <WrapperOrder className="flex flex-row justify-between" >
                    <div className="relative pl-[59px]">
                        <p className="mb-[11px] font-[400] leading-[18px] text-[18px] text-[#ffffff]">{t("AdminDashboard.order_id")} {item.id}</p>
                        <p className="mb-[10px] font-[400] leading-[16px] text-[16px] text-[#7F7F7F]">{formatDate(item.date, i18n.language)}</p>
                        <p className="mb-[10px] font-[600] leading-[17px] text-[17px] text-[#ffffff]">{item.status}</p>
                    </div>
                    <div className="flex flex-row gap-[50px] items-start">
                        <div className="flex flex-row flex-row gap-[10px] items-center">
                            <Eye className="w-[24px] h-[24px]" />
                            <p className="font-[400] leading-[16px] text-[16px] text-[#7F7F7F]">15</p>
                        </div>
                        <Pencil className="w-[24px] h-[24px]" />
                        <Notebook className="w-[24px] h-[24px]" />

                    </div>
                </WrapperOrder>
            </div>

        </div>
    )
}

const WrapperOrder = styled.div`
   &::before {
    content: "";
    position: absolute;
    left: 20px;
    top: 22px;
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
    bottom: 24px;
    width: calc(100% - 40px);
    height: 1px;
    background-color: #ffffff42;
   }
`;