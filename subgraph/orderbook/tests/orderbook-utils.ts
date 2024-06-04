import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BuyOrderCreated,
  BuyOrderRemoved,
  BuyOrderUpdated,
  SellOrderCreated,
  SellOrderRemoved,
  SellOrderUpdated
} from "../generated/Orderbook/Orderbook"

export function createBuyOrderCreatedEvent(
  id: Bytes,
  creator: Address,
  tokenAddress: Address,
  tokenId: BigInt,
  amount: BigInt,
  pricePerOne: BigInt
): BuyOrderCreated {
  let buyOrderCreatedEvent = changetype<BuyOrderCreated>(newMockEvent())

  buyOrderCreatedEvent.parameters = new Array()

  buyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  buyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  buyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  buyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  buyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  buyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "pricePerOne",
      ethereum.Value.fromUnsignedBigInt(pricePerOne)
    )
  )

  return buyOrderCreatedEvent
}

export function createBuyOrderRemovedEvent(
  id: Bytes,
  creator: Address,
  tokenAddress: Address,
  tokenId: BigInt,
  amount: BigInt,
  pricePerOne: BigInt
): BuyOrderRemoved {
  let buyOrderRemovedEvent = changetype<BuyOrderRemoved>(newMockEvent())

  buyOrderRemovedEvent.parameters = new Array()

  buyOrderRemovedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  buyOrderRemovedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  buyOrderRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  buyOrderRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  buyOrderRemovedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  buyOrderRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "pricePerOne",
      ethereum.Value.fromUnsignedBigInt(pricePerOne)
    )
  )

  return buyOrderRemovedEvent
}

export function createBuyOrderUpdatedEvent(
  id: Bytes,
  creator: Address,
  tokenAddress: Address,
  tokenId: BigInt,
  amount: BigInt,
  pricePerOne: BigInt
): BuyOrderUpdated {
  let buyOrderUpdatedEvent = changetype<BuyOrderUpdated>(newMockEvent())

  buyOrderUpdatedEvent.parameters = new Array()

  buyOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  buyOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  buyOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  buyOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  buyOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  buyOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "pricePerOne",
      ethereum.Value.fromUnsignedBigInt(pricePerOne)
    )
  )

  return buyOrderUpdatedEvent
}

export function createSellOrderCreatedEvent(
  id: Bytes,
  creator: Address,
  tokenAddress: Address,
  tokenId: BigInt,
  amount: BigInt,
  pricePerOne: BigInt
): SellOrderCreated {
  let sellOrderCreatedEvent = changetype<SellOrderCreated>(newMockEvent())

  sellOrderCreatedEvent.parameters = new Array()

  sellOrderCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  sellOrderCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  sellOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  sellOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  sellOrderCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  sellOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "pricePerOne",
      ethereum.Value.fromUnsignedBigInt(pricePerOne)
    )
  )

  return sellOrderCreatedEvent
}

export function createSellOrderRemovedEvent(
  id: Bytes,
  creator: Address,
  tokenAddress: Address,
  tokenId: BigInt,
  amount: BigInt,
  pricePerOne: BigInt
): SellOrderRemoved {
  let sellOrderRemovedEvent = changetype<SellOrderRemoved>(newMockEvent())

  sellOrderRemovedEvent.parameters = new Array()

  sellOrderRemovedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  sellOrderRemovedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  sellOrderRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  sellOrderRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  sellOrderRemovedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  sellOrderRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "pricePerOne",
      ethereum.Value.fromUnsignedBigInt(pricePerOne)
    )
  )

  return sellOrderRemovedEvent
}

export function createSellOrderUpdatedEvent(
  id: Bytes,
  creator: Address,
  tokenAddress: Address,
  tokenId: BigInt,
  amount: BigInt,
  pricePerOne: BigInt
): SellOrderUpdated {
  let sellOrderUpdatedEvent = changetype<SellOrderUpdated>(newMockEvent())

  sellOrderUpdatedEvent.parameters = new Array()

  sellOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  sellOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  sellOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  sellOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  sellOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  sellOrderUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "pricePerOne",
      ethereum.Value.fromUnsignedBigInt(pricePerOne)
    )
  )

  return sellOrderUpdatedEvent
}
