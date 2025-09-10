"use client"

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Autonomy } from "@/components/Product/Autonomy/Autonomy";
import { Models } from "@/components/Product/Models/Models";
import { Possibilities } from "@/components/Product/Possibilities/Possibilities";
import { ProductInformation } from "@/components/Product/ProductInformation/ProductInformation";
import { ProductVariant } from "@/components/Product/ProductVariant/ProductVariant";
import { Specifications } from "@/components/Product/Specifications/Specifications";
import { Steps } from "@/components/Product/Steps/Steps";
import { Support } from "@/components/Support/Support";

export default function ProductPage() {

    return (
        <>
            <ProductVariant />
            <div className="mb-[45px]!">
                <Breadcrumbs path={["Главная", "Продукция", "Онлайн ИБП Ariet T3K"]} alias={["/", "products", "current"]} />
            </div>
            <ProductInformation />
            <Steps />
            <Specifications />
            <Autonomy />
            <Possibilities />
            <Models />
            <Support />
        </>

    );
}
