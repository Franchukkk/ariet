"use client";

import { ThanksForOrder } from "@/components/thans-for-order/thanks-for-order";
import styled from "styled-components";

const orderNumber = "234234234234";

export default function ThanksForOrderView() {
    return (
        <WrapperThanksForOrder className="main-wrapper text-center pt-[75px] pb-[400px]">
            <ThanksForOrder orderNumber={orderNumber} />
        </WrapperThanksForOrder>
    )
}

const WrapperThanksForOrder = styled.div`
    @media (max-width: 1000px) {
        padding: 100px 0;
    }
`;