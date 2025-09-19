import type { NextConfig } from 'next'
import type { RuleSetRule } from 'webpack'

const nextConfig: NextConfig = {
	reactStrictMode: true,
	compiler: { styledComponents: true },

	typescript: { ignoreBuildErrors: true },
	eslint: { ignoreDuringBuilds: true },
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'rpktask.sytes.net'
			}
		]
	},

	webpack(config) {
		const assetRule = config.module.rules.find(
			(rule: RuleSetRule | undefined) =>
				typeof rule === 'object' &&
				rule?.test instanceof RegExp &&
				rule.test.test('.svg')
		)

		if (assetRule && typeof assetRule === 'object') {
			;(assetRule as RuleSetRule).exclude = /\.svg$/i
		}

		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			oneOf: [
				{ resourceQuery: /url/, type: 'asset/resource' },
				{
					use: [
						{
							loader: '@svgr/webpack',
							options: { titleProp: true }
						}
					]
				}
			]
		})

		return config
	}
}

export default nextConfig
