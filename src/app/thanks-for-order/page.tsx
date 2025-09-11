"use client";

import { Background } from "@/components/About/Hero/Background";
import { ThanksForOrder } from "@/components/thanks-for-order/thanks-for-order";
import styled from "styled-components";

const orderNumber = "234234234234";

export default function Page() {
    return (
        <>
            <WrapperThanksForOrder className="main-wrapper text-center pt-[75px] pb-[400px]">
                <ThanksForOrder orderNumber={orderNumber} />
            </WrapperThanksForOrder>
            <CanvasBlock>
                <Background />
            </CanvasBlock>

        </>
    )
}

const WrapperThanksForOrder = styled.div`
    @media (max-width: 1000px) {
        padding: 100px 0;
    }
`;

const CanvasBlock = styled.div`
    transform: rotate(-24deg);
    position: absolute;
    right: -200px;
    width: 840px;
    height: 644px;
    z-index: -2;
    overflow: hidden;

    @media (max-width: 1000px) {
        right: -500px;
    }
`;