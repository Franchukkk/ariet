import { useTranslation } from "react-i18next";
import styled from "styled-components";



interface Product {
    id: number;
    name: string;
    price: number;
    photo: any;
    description: string;
}

interface ProductCartProps {
    product: Product;
    index: number;
    quantity: number;
    onQuantityChange: (id: number, value: number) => void;
}

export const ProductCart = ({ product, index, quantity, onQuantityChange }: ProductCartProps) => {
    const { t } = useTranslation("common");

    return (
        <WrapperLi
            className={`flex flex-row justify-between py-[20px] px-[35px] border border-dashed p-4 border-[#ffffff42] items-center ${index === 0 ? 'border-t-1' : 'border-t-0'}`}
        >
            <img className="mr-[37px]" width={124} height={80} alt={product.name} src={product.photo.src} />
            <div className="pr-[20px] relative">
                <p className="text-[14px] font-medium text-[#7F7F7F] absolute top-[-20px] left-0">{product.description}</p>
                <p className="text-[22px] font-bold w-[300px]">{product.name}</p>
            </div>
            <p className="text-[20px] font-bold w-[100px]">{product.price} {t("Basket.currency")}</p>

            <select
                value={quantity}
                onChange={(e) => onQuantityChange(product.id, Number(e.target.value))}
                className="focus:outline-none focus:ring-0 focus:border-transparent w-[90px] h-[50px] rounded-[5px] border border-[#808080] bg-transparent text-center text-[16px] font-medium focus:outWrapperLine-none focus:ring-2 focus:ring-blue-500"
            >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>

            <p className="text-[20px] font-bold w-[140px] text-center">
                {product.price * quantity} {t("Basket.currency")}
            </p>
            <button>
                <img className="h-[20px] w-[20px]" src="/image/bin.png" alt="Delete" />
            </button>
        </WrapperLi >
    );
};


const WrapperLi = styled.li`
    & p{
    text-align: center;
    position: relative;
    top: 0;
    }

    & img{
        position: relative;
        margin: 0;
    }

    @media (max-width: 1000px) {
        flex-direction: column;
        align-items: center;

        select{
            margin-top: 10px;
            margin-bottom: 10px;
            height: 30px;
        }
    }
`;