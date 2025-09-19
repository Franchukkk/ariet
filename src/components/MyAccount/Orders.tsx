"use client";

import { OrderCart } from "./OrderCart";
import moduleImg from "@/assets/img/module.png";
import { useEffect, useState } from "react";

interface OrderProps {
    id: number;
    status: string;
    date: string;
    total: number;
    price: number;
    delivery: number;
    declaration_number: string;
    tel: string;
    deliveyId: string;
    address: string;
    products: Product[];
}

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    photo: any;
    description: string;
}

// const orders = [
//     {
//         id: 11111111,
//         status: "delivered",
//         date: "2025-01-01:00:00",
//         total: 7000,
//         price: 1000,
//         delivery: 100,
//         declaration_number: "1234567890",
//         tel: "+38 (099) 123-45-67",
//         deliveyId: "234234234",
//         address: "Днепр (Днепропетровская область, Поштомат Новая Почта №78900, проспект Свободы 21 (маг.АТБ)",
//         city: "Днепр",
//         products: [
//             {
//                 id: 111111,
//                 name: "Product 1",
//                 price: 1000,
//                 quantity: 2,
//                 photo: moduleImg,
//                 description: "Description 1",
//             },
//             {
//                 id: 222222,
//                 name: "Product 1",
//                 price: 1000,
//                 quantity: 1,
//                 photo: moduleImg,
//                 description: "Description 1",
//             },
//             {
//                 id: 333333,
//                 name: "Product 1",
//                 price: 1000,
//                 quantity: 2,
//                 photo: moduleImg,
//                 description: "Description 1",
//             },
//             {
//                 id: 444444,
//                 name: "Product 1",
//                 price: 1000,
//                 quantity: 2,
//                 photo: moduleImg,
//                 description: "Description 1",
//             },
//         ],
//     },
//     {
//         id: 22222222,
//         status: "paid",
//         date: "2025-01-01:00:00",
//         total: 1000,
//         price: 1000,
//         delivery: 100,
//         declaration_number: "1234567890",
//         tel: "+380991234567",
//         deliveyId: "1234567890",
//         address: "Киев, ул. Примерная 123",
//         products: [
//             {
//                 id: 111111,
//                 name: "Product 1",
//                 price: 1000,
//                 quantity: 2,
//                 photo: moduleImg,
//                 description: "Description 1",
//             },
//             {
//                 id: 222222,
//                 name: "Product 1",
//                 price: 1000,
//                 quantity: 1,
//                 photo: moduleImg,
//                 description: "Description 1",
//             },
//             {
//                 id: 333333,
//                 name: "Product 1",
//                 price: 1000,
//                 quantity: 2,
//                 photo: moduleImg,
//                 description: "Description 1",
//             },
//             {
//                 id: 444444,
//                 name: "Product 1",
//                 price: 1000,
//                 quantity: 2,
//                 photo: moduleImg,
//                 description: "Description 1",
//             },
//             {
//                 id: 555555,
//                 name: "Product 1",
//                 price: 1000,
//                 quantity: 2,
//                 photo: moduleImg,
//                 description: "Description 1",
//             },
//         ],
//     },
//     {
//         id: 33333333,
//         status: "sent",
//         date: "2025-01-01:00:00",
//         total: 1000,
//         price: 1000,
//         delivery: 100,
//         declaration_number: "1234567890",
//         tel: "+380991234567",
//         deliveyId: "1234567890",
//         address: "Харьков, ул. Примерная 456",
//         products: [
//             {
//                 id: 333333,
//                 name: "Product 1",
//                 price: 1000,
//                 quantity: 2,
//                 photo: moduleImg,
//                 description: "Description 1",
//             },
//         ],
//     },
//     {
//         id: 44444444,
//         status: "draft",
//         date: "2025-01-01:00:00",
//         total: 1000,
//         price: 1000,
//         delivery: 100,
//         declaration_number: "1234567890",
//         tel: "+380991234567",
//         deliveyId: "1234567890",
//         address: "Одесса, ул. Примерная 789",
//         products: [
//             {
//                 id: 444444,
//                 name: "Product 1",
//                 price: 1000,
//                 quantity: 2,
//                 photo: moduleImg,
//                 description: "Description 1",
//             },
//         ],
//     },
// ];

export const Orders = () => {
    const [orders, setOrders] = useState<OrderProps[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        fetch("https://rpktask.sytes.net/api/orders/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        })
            .then(res => res.json())
            .then(data => setOrders(data.results))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }, [])

    console.log(orders)

    if (loading) {
        return <p className="text-[22px] leading-[22px] !font-[600] font-medium text-[#ffffff] text-center my-[200px]">Loading ...</p>
    }

    if (orders.length === 0) {
        return <p className="text-[22px] leading-[22px] !font-[600] font-medium text-[#ffffff] text-center my-[200px]">Заказы не найдены</p>
    }


    return (
        <ul className="main-wrapper flex flex-col gap-[20px] mb-[200px]">
            {orders.map((order) => (
                <OrderCart key={order.id} order={order} />
            ))}
        </ul>
    );
};