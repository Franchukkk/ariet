import { useTranslation } from "react-i18next";
import { ProductCart } from "./ProductCart";
import moduleImg from "@/assets/img/module.png";

const products = [
    {
        id: 1,
        name: "Онлайн ИБП ARIET1",
        price: 100,
        quantity: 1,
        photo: moduleImg,
        description: "Однофазные ИБП"
    },
    {
        id: 2,
        name: "Онлайн ИБП ARIET2",
        price: 200,
        quantity: 2,
        photo: moduleImg,
        description: "Однофазные ИБП"
    },
    {
        id: 3,
        name: "Онлайн ИБП ARIET3",
        price: 300,
        quantity: 3,
        photo: moduleImg,
        description: "Однофазные ИБП"
    }
]

const BasketList = () => {
    const { t } = useTranslation("common");

    if (products.length === 0) {
        return (
            <div>
                <h1 className="text-center text-[24px] font-bold">Корзина пуста</h1>
            </div>
        )
    }

    return (
        <div className="flex flex-row gap-[20px]">
            <ul>
                {products.map((product) => (
                    <ProductCart key={product.id} product={product} />
                ))}
            </ul>
            <div>
                <div></div>
                <div></div>
                <div></div>
                <button>{t("Basket.make_order")}</button>
                <div></div>
            </div>
        </div>
    )
}

export default BasketList;