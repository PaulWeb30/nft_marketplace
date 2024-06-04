import {
  BuyOrderCreated as BuyOrderCreatedEvent,
  BuyOrderRemoved as BuyOrderRemovedEvent,
  BuyOrderUpdated as BuyOrderUpdatedEvent,
  SellOrderCreated as SellOrderCreatedEvent,
  SellOrderRemoved as SellOrderRemovedEvent,
  SellOrderUpdated as SellOrderUpdatedEvent
} from "../generated/Orderbook/Orderbook"
import {
  BuyOrderCreated,
  BuyOrderRemoved,
  BuyOrderUpdated,
  SellOrderCreated,
  SellOrderRemoved,
  SellOrderUpdated
} from "../generated/schema"

export function handleBuyOrderCreated(event: BuyOrderCreatedEvent): void {
  let entity = new BuyOrderCreated(
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

  entity.save()
}

export function handleSellOrderCreated(event: SellOrderCreatedEvent): void {
  let entity = new SellOrderCreated(
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

  entity.save()
}
