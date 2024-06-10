export interface Root {
	status: string
	total: string
	page: string
	page_size: string
	cursor: string
	result: Result[]
}

export interface Result {
	token_address: `0x${string}`
	token_id: bigint
	contract_type: string
	owner_of: `0x${string}`
	block_number: string
	block_number_minted: string
	token_uri: string
	metadata: string
	normalized_metadata: string
	media: string
	amount: string
	name: string
	symbol: string
	token_hash: string
	last_token_uri_sync: string
	last_metadata_sync: string
	possible_spam: string
	verified_collection: string
	ownerOf: `0x${string}`
	collection_banner_image: string
	collection_logo: string
}

type Buy = {
	id: string
	buyer: string
	tokenId: string
	price: number
}

export type OrderCreated = {
	id: string
	orderId: bigint
	price: bigint
	isClosed: boolean
	creator: `0x${string}`
	nft: `0x${string}`
	tokenId: bigint
}

export type ProposalCreated = {
	id: string
	orderId: bigint
	proposeId: bigint
	nft: `0x${string}`
	nftOwner: `0x${string}`
	proposedPrice: bigint
	tokenId: bigint
	proposer: `0x${string}`
	isClosed: boolean
	isOrderClosed: boolean
}

export type ProposalCanceled = {
	id: string
	price: number
	proposeId: string
}

type QueryResult = {
	buys: Buy[]
	orderCreateds: OrderCreated[]
	proposalCanceleds: ProposalCanceled[]
	proposalCreateds: ProposalCreated[]
}

export type SellOrderCreated = {
	id: `0x${string}`
	pricePerOne: bigint
	isClosed: boolean
	tokenId: bigint
	amount: bigint
	creator: `0x${string}`
	tokenAddress: `0x${string}`
}

export type BuyOrderCreated = {
	id: `0x${string}`
	pricePerOne: bigint
	isClosed: boolean
	tokenId: bigint
	amount: bigint
	creator: `0x${string}`
	tokenAddress: `0x${string}`
}
