"use client"

import { getRefreshToken, refreshToken } from "@/helpers/auth"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {


    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const pathname = usePathname()

    let idInterval: NodeJS.Timeout

    useEffect(() => {
        idInterval = setInterval(refreshToken, 2 * 60 * 1000);

        return () => clearInterval(idInterval)
    }, [])


    useEffect(() => {
        const refreshTokenValue = getRefreshToken()

        if (!refreshTokenValue) {
            if (pathname === '/login' || pathname === '/registration') {
                router.push('/login')
                return
            } else {
                router.push('/login')
                return
            }
        }

        fetch('https://rpktask.sytes.net/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshTokenValue })
        }).then(res => res.json()).then(data => {
            if (data.code === 'token_not_valid') {
                router.push('/login')
                return
            }
            if (data.access) {
                localStorage.setItem('accessToken', data.access)

                fetch('https://rpktask.sytes.net/api/users/me/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.access}`
                    },
                }).then(res => res.json())
                    .then(userData => {
                        const userRole = userData.role

                        // Визначаємо куди має йти користувач
                        let targetPath = '/login'
                        if (userRole === 'CLIENT') {
                            targetPath = '/my-account'
                        } else if (userRole === 'AMBASSADOR') {
                            targetPath = '/ambassador'
                        } else if (userRole === 'ADMIN') {
                            targetPath = '/admin-dashboard'
                        }

                        // Редіректимо ТІЛЬКИ якщо користувач НЕ на своїй сторінці
                        if (pathname !== targetPath) {
                            console.log('Redirecting to:', targetPath)
                            router.push(targetPath)
                            return
                        }
                        setIsLoading(false)
                    })
            }
        }).catch(err => {
            console.error('Auth error:', err)
            router.push('/login')
        })

        return () => clearInterval(idInterval as NodeJS.Timeout)
    }, [pathname, router])

    return <div className="mb-[50px]">{isLoading ? <div className="flex justify-center items-center h-[500px]">Loading...</div> : children}</div>
}