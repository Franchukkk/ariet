'use client'

import { useEffect, useRef, useState } from 'react'

export type Lng = 'ru' | 'en'
export interface ICategory {
	id: number
	name: string
	image?: string | null
}

type FetchOpts = {
	path?: string
	lng?: Lng
	pageSize?: number
	enabled?: boolean
	dedupeTTL?: number
	extraParams?: Record<string, string | number | boolean | undefined | null>
	credentials?: RequestCredentials
	debug?: boolean
}

type State = { categories: ICategory[]; loading: boolean; error: string | null }
type CacheEntry = {
	ts: number
	data: ICategory[] | null
	error: string | null
	promise?: Promise<ICategory[]>
}

// ---------- ГЛОБАЛЬНИЙ КЕШ (переживає Fast Refresh) ----------
const G = globalThis as any
const GLOBAL_KEY = '__CATEGORIES_CACHE__'
const CACHE: Map<string, CacheEntry> = G[GLOBAL_KEY] || new Map()
if (!G[GLOBAL_KEY]) G[GLOBAL_KEY] = CACHE
// --------------------------------------------------------------

const isAbort = (e: any) =>
	e?.name === 'AbortError' || /abort/i.test(String(e?.message))

const key = (p: string, l: string, n: number, e?: any) =>
	['same-origin', p, l, n, JSON.stringify(e || {})].join('|')

async function fetchCategories({
	path,
	lng,
	pageSize,
	credentials,
	signal,
	extraParams,
	debug
}: Required<
	Pick<FetchOpts, 'path' | 'lng' | 'pageSize' | 'credentials' | 'debug'>
> & {
	signal?: AbortSignal
	extraParams?: FetchOpts['extraParams']
}): Promise<ICategory[]> {
	const url = new URL(path, window.location.origin)
	url.searchParams.set('page_size', String(pageSize))
	if (lng) url.searchParams.set('lng', lng)
	if (extraParams) {
		for (const [k, v] of Object.entries(extraParams)) {
			if (v != null) url.searchParams.set(k, String(v))
		}
	}
	debug && console.debug('[useCategories] GET', url.toString())

	let res: Response
	try {
		res = await fetch(url, {
			method: 'GET',
			credentials,
			cache: 'no-store',
			headers: { 'Content-Type': 'application/json' },
			signal
		})
	} catch (e: any) {
		if (isAbort(e)) throw e
		throw new Error(`NETWORK: ${e?.message || 'Failed to fetch'}`)
	}

	if (!res.ok) {
		let body = ''
		try {
			body = await res.text()
		} catch {}
		throw new Error(
			`HTTP ${res.status}${res.statusText ? ' ' + res.statusText : ''}${
				body ? ` — ${body.slice(0, 200)}` : ''
			}`
		)
	}

	const json: any = await res.json()
	const arr: any[] = Array.isArray(json) ? json : (json?.results ?? [])

	return arr.map((c: any) => {
		const localized = c[`name_${lng}`]
		const name =
			(typeof localized === 'string' && localized) ||
			(typeof c.name === 'string' && c.name) ||
			(typeof c.title === 'string' && c.title) ||
			(typeof c.label === 'string' && c.label) ||
			''

		const rawImg = c.image ?? c.photo ?? c.banner ?? null
		const image = typeof rawImg === 'string' ? rawImg : (rawImg?.url ?? null)

		return { id: c.id, name, image }
	})
}

export function useCategories(opts: FetchOpts = {}) {
	const {
		path = '/front-proxy/categories',
		lng = 'ru',
		pageSize = 99,
		enabled = true,
		dedupeTTL = 60_000,
		extraParams,
		credentials = 'include',
		debug = false
	} = opts

	const [state, setState] = useState<State>({
		categories: [],
		loading: !!enabled,
		error: null
	})

	const abortRef = useRef<AbortController | null>(null)

	useEffect(() => {
		if (!enabled) return
		let mounted = true

		const k = key(path, lng, pageSize, extraParams)
		const now = Date.now()
		const cached = CACHE.get(k)

		// свіжа data
		if (cached && cached.data && now - cached.ts < dedupeTTL) {
			mounted &&
				setState({
					categories: cached.data,
					loading: false,
					error: cached.error
				})
			return
		}

		// є проміс — підписались (і при abort — прибрали)
		if (cached?.promise) {
			mounted && setState(p => ({ ...p, loading: true }))
			cached.promise
				.then(d => {
					if (mounted) setState({ categories: d, loading: false, error: null })
				})
				.catch(e => {
					if (!mounted) return
					if (isAbort(e)) {
						if (CACHE.get(k)?.promise === cached.promise) CACHE.delete(k)
						return
					}
					setState({
						categories: [],
						loading: false,
						error: e?.message || 'Failed to load'
					})
				})
			return
		}

		setState(p => ({ ...p, loading: true }))

		abortRef.current?.abort()
		const controller = new AbortController()
		abortRef.current = controller

		const p = fetchCategories({
			path,
			lng,
			pageSize,
			credentials,
			signal: controller.signal,
			extraParams,
			debug
		})
		CACHE.set(k, { ts: now, data: null, error: null, promise: p })

		p.then(d => {
			if (!mounted) return
			CACHE.set(k, { ts: Date.now(), data: d, error: null }) // перезапис без promise
			setState({ categories: d, loading: false, error: null })
		}).catch(e => {
			if (controller.signal.aborted || isAbort(e)) {
				if (CACHE.get(k)?.promise === p) CACHE.delete(k)
				return
			}
			if (!mounted) return
			CACHE.set(k, {
				ts: Date.now(),
				data: null,
				error: e?.message || 'Failed to load'
			})
			setState({
				categories: [],
				loading: false,
				error: e?.message || 'Failed to load'
			})
			debug && console.warn('[useCategories] error:', e?.message)
		})

		return () => {
			mounted = false
			controller.abort()
			if (CACHE.get(k)?.promise === p) CACHE.delete(k)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		path,
		lng,
		pageSize,
		enabled,
		dedupeTTL,
		JSON.stringify(extraParams),
		debug
	])

	const refetch = async () => {
		const k = key(path, lng, pageSize, extraParams)
		CACHE.delete(k)

		abortRef.current?.abort()
		const controller = new AbortController()
		abortRef.current = controller

		setState(p => ({ ...p, loading: true, error: null }))
		try {
			const d = await fetchCategories({
				path,
				lng,
				pageSize,
				credentials,
				signal: controller.signal,
				extraParams,
				debug
			})
			CACHE.set(k, { ts: Date.now(), data: d, error: null })
			setState({ categories: d, loading: false, error: null })
		} catch (e: any) {
			if (controller.signal.aborted || isAbort(e)) return
			setState({
				categories: [],
				loading: false,
				error: e?.message || 'Failed to load'
			})
		}
	}

	return { ...state, refetch }
}

// ВАЖЛИВО: усі споживачі ходять за ОДНИМ запитом (99), а тут лише ріжемо масив
export const useCategoriesExact = (
	n: number,
	opts?: Omit<FetchOpts, 'pageSize'>
) => {
	const MAX_SHARED = 99
	const st = useCategories({ ...opts, pageSize: Math.max(MAX_SHARED, n) }) // завжди 99
	return { ...st, categories: st.categories.slice(0, n) }
}
