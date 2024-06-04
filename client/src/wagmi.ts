import { http, createConfig } from 'wagmi'
import { localhost, mainnet, sepolia } from 'wagmi/chains'

export const config = createConfig({
	chains: [mainnet, sepolia, localhost],
	connectors: [],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
		[localhost.id]: http(),
	},
})

declare module 'wagmi' {
	interface Register {
		config: typeof config
	}
}
