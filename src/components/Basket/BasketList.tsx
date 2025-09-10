import { useTranslation } from "react-i18next";
import { ProductCart } from "./ProductCart";
import moduleImg from "@/assets/img/module.png";
import styled from "styled-components";
import { useEffect, useState } from "react";

const products = [
    {
        id: 1,
        name: "Онлайн ИБП ARIET1",
        price: 100,
        photo: moduleImg,
        description: "Однофазные ИБП"
    },
    {
        id: 2,
        name: "Онлайн ИБП ARIET2",
        price: 200,
        photo: moduleImg,
        description: "Однофазные ИБП"
    },
    {
        id: 3,
        name: "Онлайн ИБП ARIET3",
        price: 300,
        photo: moduleImg,
        description: "Однофазные ИБП"
    }
]

export const BasketList = () => {
    const { t } = useTranslation("common");
    const [promocode, setPromocode] = useState("");
    const [quantities, setQuantities] = useState<Record<number, number>>(
        localStorage.getItem("quantities") ? JSON.parse(localStorage.getItem("quantities") || "{}") : {
            ...Object.fromEntries(products.map(p => [p.id, 1]))
        }
    );

    useEffect(() => {
        localStorage.setItem("quantities", JSON.stringify(quantities));
        
    }, [quantities]);

    const handleQuantityChange = (id: number, value: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: value
        }));
    };

    if (products.length === 0) {
        return (
            <div>
                <h1 className="text-center text-[24px] font-bold">Корзина пуста</h1>
            </div>
        )
    }


    console.log(quantities);
    return (
        <Wrapper className="flex flex-row gap-[20px]">
            <ul className="flex flex-col w-[100%]">
                {products.map((product, index) => (
                    <ProductCart
                        key={product.id}
                        product={product}
                        index={index}
                        quantity={quantities[product.id]}
                        onQuantityChange={handleQuantityChange}
                    />
                ))}
            </ul>
            <div className="w-[100%] max-w-[435px] px-[20px] py-[28px] bg-[#1B1919] rounded-[8px]">
                <div className="flex flex-row justify-between mb-[30px]">
                    <p className="w-[45%] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]">{t("Basket.price")}:</p>
                    <p className="w-[45%] text-[#FFFFFFA8] relative inline-block text-[16px] font-bold">
                        4 550 {t("Basket.currency")}
                        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-gray-300 to-transparent"></span>
                    </p>

                </div>
                <div className="flex flex-row justify-between mb-[30px]">
                    <p className="w-[45%] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]">{t("Basket.delivery")}:</p>
                    <p className="w-[45%] text-[#FFFFFFA8] relative inline-block text-[16px] font-bold">
                        200 {t("Basket.currency")}
                        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-gray-300 to-transparent"></span>
                    </p>

                </div>
                <div className="flex flex-row justify-between mb-[30px]">
                    <p className="w-[45%] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]">{t("Basket.total")}:</p>
                    <p className="w-[45%] text-[#FFFFFFA8] relative inline-block text-[18px] text-[#FFFFFF] font-bold">
                        {products.reduce(
                            (sum, product) => sum + product.price * (quantities[product.id] || 1),
                            0
                        )} {t("Basket.currency")}
                        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-gray-300 to-transparent"></span>
                    </p>
                </div>
                <div className="flex flex-row justify-between">
                    <button className="bg-[#4BC785] w-[100%] mb-[30px] rounded-[61px] h-[58px] font-bold text-[15px] text-center text-[#000000] cursor-pointer">{t("Basket.make_order")}</button>
                </div>
                <div className="flex flex-row justify-between">
                    <div className="w-full flex flex-col relative">
                        <StyledInput value={promocode} placeholder=" " required name="promocode" type="text" onChange={(e) => { setPromocode(e.target.value) }} />
                        <StyledLabel>{t("Basket.promo_code")}</StyledLabel>
                    </div>
                    <button className={"w-[145px] h-[58px] text-bold rounded-[61px] text-[#ffffff] border-[1px] border-[#4BC785] text-[15px] text-center cursor-pointer"}>{t("Basket.add_promo_code")}</button>
                </div>

            </div>
        </Wrapper >
    )
}

const Wrapper = styled.div`
    @media (max-width: 1280px) {
        flex-direction: column;
        align-items: center;
    }
`;

const StyledInput = styled.input`
   width: 100%;
   height: 50px;
   border-bottom: 1px solid #ffffff8a;
   outline: none;
   background: none;
   padding: 5px 0;
   z-index: 5;

    &:not(:placeholder-shown) + label {
        top: -5px;
        font-size: 12px;
    };

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
    
    -webkit-text-fill-color: #ffffff; /* Устанавливает цвет текста (опционально) */
    transition: background-color 5000s ease-in-out 0s; /* Для плавного изменения цвета текста */
}
   
`;

const StyledLabel = styled.label`
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #7F7F7F;
    position: absolute;
    top: 10px;
    left: 0;
    transition: all 0.3s;
    z-index: 0;

    .relative:focus-within & {
    top: -5px;
    font-size: 12px;
  }
`;
