import {
	BuyOrderCreated as BuyOrderCreatedEvent,
	BuyOrderRemoved as BuyOrderRemovedEvent,
	BuyOrderUpdated as BuyOrderUpdatedEvent,
	SellOrderCreated as SellOrderCreatedEvent,
	SellOrderRemoved as SellOrderRemovedEvent,
	SellOrderUpdated as SellOrderUpdatedEvent,
} from '../generated/Orderbook/Orderbook'
import {
	BuyOrderCreated,
	BuyOrderRemoved,
	BuyOrderUpdated,
	SellOrderCreated,
	SellOrderRemoved,
	SellOrderUpdated,
} from '../generated/schema'

export function handleBuyOrderCreated(event: BuyOrderCreatedEvent): void {
	let entity = new BuyOrderCreated(event.params.id)

	entity.Orderbook_id = event.params.id
	entity.creator = event.params.creator
	entity.tokenAddress = event.params.tokenAddress
	entity.tokenId = event.params.tokenId
	entity.amount = event.params.amount
	entity.pricePerOne = event.params.pricePerOne

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash
	entity.isClosed = false

	entity.save()
}

export function handleBuyOrderRemoved(event: BuyOrderRemovedEvent): void {
	let entity = new BuyOrderRemoved(
		event.transaction.hash.concatI32(event.logIndex.toI32())
	)

	entity.Orderbook_id = event.params.id
	entity.creator = event.params.creator
	entity.tokenAddress = event.params.tokenAddress
	entity.tokenId = event.params.tokenId
	entity.amount = event.params.amount
	entity.pricePerOne = event.params.pricePerOne

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash

	let buyOrder = BuyOrderCreated.load(event.params.id)

	if (buyOrder == null) {
		buyOrder = new BuyOrderCreated(event.params.id)
		buyOrder.Orderbook_id = event.params.id
		buyOrder.creator = event.params.creator
		buyOrder.tokenAddress = event.params.tokenAddress
		buyOrder.tokenId = event.params.tokenId
		buyOrder.amount = event.params.amount
		buyOrder.pricePerOne = event.params.pricePerOne
		buyOrder.blockNumber = event.block.number
		buyOrder.blockTimestamp = event.block.timestamp
		buyOrder.transactionHash = event.transaction.hash
		buyOrder.isClosed = true
	}

	buyOrder.isClosed = true

	buyOrder.save()
	entity.save()
}

export function handleBuyOrderUpdated(event: BuyOrderUpdatedEvent): void {
	let entity = new BuyOrderUpdated(
		event.transaction.hash.concatI32(event.logIndex.toI32())
	)
	entity.Orderbook_id = event.params.id
	entity.creator = event.params.creator
	entity.tokenAddress = event.params.tokenAddress
	entity.tokenId = event.params.tokenId
	entity.amount = event.params.amount
	entity.pricePerOne = event.params.pricePerOne

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash

	let buyOrder = BuyOrderCreated.load(event.params.id)

	if (buyOrder == null) {
		buyOrder = new BuyOrderCreated(event.params.id)
		buyOrder.Orderbook_id = event.params.id
		buyOrder.creator = event.params.creator
		buyOrder.tokenAddress = event.params.tokenAddress
		buyOrder.tokenId = event.params.tokenId
		buyOrder.amount = event.params.amount
		buyOrder.pricePerOne = event.params.pricePerOne
		buyOrder.blockNumber = event.block.number
		buyOrder.blockTimestamp = event.block.timestamp
		buyOrder.transactionHash = event.transaction.hash
		buyOrder.isClosed = false
	}

	buyOrder.amount = event.params.amount
	buyOrder.pricePerOne = event.params.pricePerOne

	buyOrder.save()
	entity.save()
}

export function handleSellOrderCreated(event: SellOrderCreatedEvent): void {
	let entity = new SellOrderCreated(event.params.id)

	entity.Orderbook_id = event.params.id
	entity.creator = event.params.creator
	entity.tokenAddress = event.params.tokenAddress
	entity.tokenId = event.params.tokenId
	entity.amount = event.params.amount
	entity.pricePerOne = event.params.pricePerOne

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash
	entity.isClosed = false

	entity.save()
}

export function handleSellOrderRemoved(event: SellOrderRemovedEvent): void {
	let entity = new SellOrderRemoved(
		event.transaction.hash.concatI32(event.logIndex.toI32())
	)
	entity.Orderbook_id = event.params.id
	entity.creator = event.params.creator
	entity.tokenAddress = event.params.tokenAddress
	entity.tokenId = event.params.tokenId
	entity.amount = event.params.amount
	entity.pricePerOne = event.params.pricePerOne

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash

	let sellOrder = SellOrderCreated.load(event.params.id)

	if (sellOrder == null) {
		sellOrder = new SellOrderCreated(event.params.id)
		sellOrder.Orderbook_id = event.params.id
		sellOrder.creator = event.params.creator
		sellOrder.tokenAddress = event.params.tokenAddress
		sellOrder.tokenId = event.params.tokenId
		sellOrder.amount = event.params.amount
		sellOrder.pricePerOne = event.params.pricePerOne
		sellOrder.blockNumber = event.block.number
		sellOrder.blockTimestamp = event.block.timestamp
		sellOrder.transactionHash = event.transaction.hash
		sellOrder.isClosed = true
	}

	sellOrder.isClosed = true

	sellOrder.save()

	entity.save()
}

export function handleSellOrderUpdated(event: SellOrderUpdatedEvent): void {
	let entity = new SellOrderUpdated(
		event.transaction.hash.concatI32(event.logIndex.toI32())
	)
	entity.Orderbook_id = event.params.id
	entity.creator = event.params.creator
	entity.tokenAddress = event.params.tokenAddress
	entity.tokenId = event.params.tokenId
	entity.amount = event.params.amount
	entity.pricePerOne = event.params.pricePerOne

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash

	let sellOrder = SellOrderCreated.load(event.params.id)

	if (sellOrder == null) {
		sellOrder = new SellOrderCreated(event.params.id)
		sellOrder.Orderbook_id = event.params.id
		sellOrder.creator = event.params.creator
		sellOrder.tokenAddress = event.params.tokenAddress
		sellOrder.tokenId = event.params.tokenId
		sellOrder.amount = event.params.amount
		sellOrder.pricePerOne = event.params.pricePerOne
		sellOrder.blockNumber = event.block.number
		sellOrder.blockTimestamp = event.block.timestamp
		sellOrder.transactionHash = event.transaction.hash
		sellOrder.isClosed = false
	}

	sellOrder.amount = event.params.amount
	sellOrder.pricePerOne = event.params.pricePerOne

	sellOrder.save()
	entity.save()
}
