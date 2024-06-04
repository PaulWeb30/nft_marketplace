import {
  BuyOrderCreated as BuyOrderCreatedEvent,
  SellOrderCreated as SellOrderCreatedEvent
} from "../generated/Orderbook/Orderbook"
import { BuyOrderCreated, SellOrderCreated } from "../generated/schema"

export function handleBuyOrderCreated(event: BuyOrderCreatedEvent): void {
  let entity = new BuyOrderCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.Orderbook_id = event.params.id
  entity.creator = event.params.creator
  entity.tokenAddress = event.params.tokenAddress
  entity.tokenId = event.params.tokenId
  entity.amount = event.params.amount

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

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
