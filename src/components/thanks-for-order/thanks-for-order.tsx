"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const ThanksForOrder = ({ orderNumber }: { orderNumber: string }) => {
    const { t } = useTranslation("common");
    return (
        <WrapperThanksForOrder>
            <h1 className="text-[50px] font-semibold text-center mb-[22px] uppercase">{t("Thanks.title")}</h1>
            <p className="uppercase text-[30px] font-semibold text-center mb-[20px]">{t("Thanks.order_number")}</p>
            <p className="text-[#1DCF94] text-[30px] font-semibold mb-[40px]">{orderNumber}</p>
            <p className="text-[22px] font-semibold text-center mb-[40px]">{t("Thanks.contact_manager")}</p>

            <ButtonBlock className="flex gap-[20px] justify-center buttons">
                <Link href="/products" className="w-[50%] max-w-[394px] text-[#000000] h-[58px] flex items-center justify-center bg-[#1DCF94] rounded-[61px] px-[20px] py-[10px]" >{t("Thanks.to_catalogue")}</Link>
                <Link href="/my-account" className="w-[50%] max-w-[394px] text-[#1DCF94] h-[58px] flex items-center justify-center bg-[transparent] border border-[#1DCF94] rounded-[61px] px-[20px] py-[10px]" >{t("Thanks.my_orders")}</Link>
            </ButtonBlock>

        </WrapperThanksForOrder>
    )
}

const WrapperThanksForOrder = styled.div`
    overflow: hidden;
    position: relative;
   @media (max-width: 1000px) {
   h1 {
    font-size: 30px;
   }
   p {
    font-size: 16px;
   }
    .buttons {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }
}
`;

const ButtonBlock = styled.div`
   > a {
    @media (max-width: 1000px) {
        width: 100%;
    }
   }
`;