const market_address = String(
	import.meta.env.VITE_MARKET_ADDRESS
) as `0x${string}`

const nft_address = String(
	import.meta.env.VITE_ORDERBOOK_ADDRESS
) as `0x${string}`

const orderbook_address = String(
	import.meta.env.VITE_ORDERBOOK_ADDRESS
) as `0x${string}`

const gameItems_address = String(
	import.meta.env.VITE_GAMEITEMS_ADDRESS
) as `0x${string}`

const subgraphApi = String(import.meta.env.VITE_SUBGRAPH_API)
const subgraphOrderbookApi = String(import.meta.env.VITE_ORDERBOOK_SUBGRAPH_API)
const moralisApi = String(import.meta.env.VITE_MORALIS_API)

const offMarket_address = String(
	import.meta.env.VITE_OFFMARKET_ADDRESS
) as `0x${string}`

export {
	market_address,
	nft_address,
	subgraphApi,
	moralisApi,
	orderbook_address,
	gameItems_address,
	subgraphOrderbookApi,
	offMarket_address,
}
