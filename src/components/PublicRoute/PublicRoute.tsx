"use client";

import { getRefreshToken } from "@/helpers/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            setIsLoading(false);
            return
        }

        fetch('https://rpktask.sytes.net/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        }).then(res => res.json()).then(data => {
            if (data.access) {
                // Отримуємо роль користувача щоб перенаправити на правильну сторінку
                localStorage.setItem('accessToken', data.access)

                fetch('https://rpktask.sytes.net/api/users/me/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.access}`
                    },
                }).then(res => res.json()).then(userData => {
                    console.log('PublicRoute: User authenticated with role:', userData.role)

                    // Перенаправляємо на відповідну сторінку залежно від ролі
                    if (userData.role === 'CLIENT') {
                        router.replace("/my-account");
                    } else if (userData.role === 'AMBASSADOR') {
                        router.replace("/ambassador");
                    } else if (userData.role === 'ADMIN') {
                        router.replace("/admin-dashboard");
                    } else {
                        router.replace("/my-account"); // За замовчуванням
                    }
                }).catch(err => {
                    console.error('Error getting user data:', err)
                    setIsLoading(false)
                })
            } else {
                // Токен невалідний, залишаємося на поточній сторінці
                setIsLoading(false);
            }
        }).catch(err => {
            console.error('PublicRoute error:', err)
            setIsLoading(false)
        })

    }, [pathname, router])

    return (
        <>
            {isLoading ? <div className="flex justify-center items-center h-[500px] mb-[50px]">Loading...</div> : children}
        </>
    );

};
