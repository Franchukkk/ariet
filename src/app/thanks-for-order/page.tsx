"use client";

import { ThanksForOrder } from "@/components/thanks-for-order/thanks-for-order";
import styled from "styled-components";
import { Background } from "@/components/About/Hero/Background";
import { PublicRoute } from "@/components/PublicRoute/PublicRoute";

const orderNumber = "234234234234";

export default function Page() {
    return (
        <PublicRoute>
            <WrapperThanksForOrder className="main-wrapper text-center pt-[75px] pb-[400px]">
                <ThanksForOrder orderNumber={orderNumber} />
                <CanvasBlock>
                    <Background />
                </CanvasBlock>
            </WrapperThanksForOrder>
        </PublicRoute>
    )
}

const WrapperThanksForOrder = styled.div`
    position: relative;
    overflow: hidden;
    @media (max-width: 1000px) {
        padding: 100px 0;
    }
`;

const CanvasBlock = styled.div`
    transform: rotate(-78deg);
    position: absolute;
    top: 180px;
    right: -837px;
    width: 160vw;
    height: 79vh;
    overflow: hidden;
    z-index: -1;

    & > div {
        opacity: 0.3;
    }

     @media (max-width: 1000px) {
        right: -150px;
    }
`;
