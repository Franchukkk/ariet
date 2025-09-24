'use client'

import useSWR from 'swr'

import { getAccessToken, logout, refreshToken } from '@/helpers/auth'

export async function requestWithToken(input: RequestInfo, init?: RequestInit) {
	let token = getAccessToken()
	if (!token) {
		const ok = await refreshToken()
		if (!ok) {
			logout()
			throw new Error('Unauthorized')
		}
		token = getAccessToken()
	}
	let res = await fetch(input, {
		...init,
		headers: {
			...init?.headers,
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	})
	if (res.status === 401 || res.status === 403) {
		const ok = await refreshToken()
		if (ok) {
			const newToken = getAccessToken()
			res = await fetch(input, {
				...init,
				headers: {
					...init?.headers,
					Authorization: `Bearer ${newToken}`,
					'Content-Type': 'application/json'
				}
			})
		} else {
			logout()
			throw new Error('Session expired')
		}
	}
	return res
}

const fetchMe = async () => {
	const res = await requestWithToken('https://rpktask.sytes.net/api/users/me/')
	if (!res.ok) throw new Error('Failed to load profile')
	return res.json()
}

export function useMe() {
	const { data, error, isLoading, mutate } = useSWR('me', fetchMe, {
		revalidateOnFocus: false
	})
	return { me: data, error, loading: isLoading, mutate }
}
