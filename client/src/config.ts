const market_address = String(
	import.meta.env.VITE_MARKET_ADDRESS
) as `0x${string}`

const nft_address = String(import.meta.env.VITE_NFT_ADDRESS) as `0x${string}`

const subgraphApi = String(import.meta.env.VITE_SUBGRAPH_API)
const moralisApi = String(import.meta.env.VITE_MORALIS_API)

export { market_address, nft_address, subgraphApi, moralisApi }
