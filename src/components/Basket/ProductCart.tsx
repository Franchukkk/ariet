import { useState } from "react";
import { Photo } from "../ModelCard/Photo";

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    photo: any;
    description: string;
}

interface ProductCartProps {
    product: Product;
}

export const ProductCart = ({ product }: ProductCartProps) => {
    const [quantity, setQuantity] = useState(product.quantity);

    return (
        <li>
            <Photo photo={product.photo} />
            {product.name}
            <div>
                <p>{product.description}</p>
                <p>{product.name}</p>
            </div>
            <p>{product.price}</p>
            <input type="number" value={product.quantity} />
            <p>{product.price * product.quantity}</p>
            <button>
                
            </button>
        </li>
    )
}