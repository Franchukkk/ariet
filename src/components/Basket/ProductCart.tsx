import { useState } from "react";
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

function formatPrice(num: number) {
    return Number(num).toLocaleString('en-US').replace(',', ' ');
}

export const ProductCart = ({ product, index, quantity, onQuantityChange }: ProductCartProps) => {
    const { t } = useTranslation("common");
    const [isOpen, setIsOpen] = useState(false);

    return (
        <WrapperLi 
            index={index}
            className={`flex flex-row justify-between py-[20px] px-[35px] border border-dashed p-4 border-[#ffffff42] items-center ${index === 0 ? 'border-t-1' : 'border-t-0'}`}
        >
            <img className="mr-[37px]" width={124} height={80} alt={product.name} src={product.photo.src} />
            <div className="pr-[20px] relative">
                <p className="text-[14px] pl-[10px] font-medium text-[#7F7F7F] absolute top-[-20px] left-0">{product.description}</p>
                <p className="text-[22px] pl-[10px] font-bold w-[250px]">{product.name}</p>
            </div>
            <p className="text-[20px] font-bold w-[100px] text-center"> {formatPrice(product.price)} {t("Basket.currency")}</p>

            <label className="relative">
                <img
                    className={`!absolute top-1/2 right-[5px] -translate-y-1/2 rotate-180 
                    transition-all duration-300 
                    ${isOpen ? "rotate-0" : ""}`}
                    src="/image/arrow-up.svg"
                    alt="arrow"
                />
                <CustomSelect
                    value={quantity}
                    onChange={(e) => onQuantityChange(product.id, Number(e.target.value))}
                    className="relative appearance-none focus:outline-none focus:ring-0 focus:border-transparent w-[90px] h-[50px] rounded-[5px] border border-[#808080] bg-transparent text-center text-[16px] font-medium focus:outWrapperLine-none focus:ring-2 focus:ring-blue-500"
                >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </CustomSelect>
            </label>


            <p className="text-[20px] font-bold  text-center">
                {formatPrice(product.price * quantity)} {t("Basket.currency")}
            </p>
            <button>
                <img className="h-[24px] w-[24px]" src="/image/bin.png" alt="Delete" />
            </button>
        </WrapperLi >
    );
};


const CustomSelect = styled.select`
    text-align-last: left;
    padding-left: 20px;

    @media (max-width: 1000px) {
        text-align-last: center;
        padding-left: 0;
    }
`;

const WrapperLi = styled.li<{ index: number }>`
  display: grid;
  grid-template-columns: 124px 1fr 100px 90px 100px 40px; /* ширини елементів */
  align-items: center;
  gap: 20px; /* відступи між колонками */
  padding: 20px 35px;
  border: 1px dashed #ffffff42;
  border-top-width: ${({ index }) => (index === 0 ? "1px" : "0")};

  & p {
    margin: 0;
  }

  & img {
    display: block;
  }

  @media (max-width: 1000px) {
    grid-template-columns: 1fr; /* один стовпець */
    grid-template-rows: auto auto auto auto auto auto;
    gap: 10px;
    justify-items: center;

    p {
      text-align: center;
    }

    select {
      margin: 10px 0;
      height: 30px;
    }
  }
`;