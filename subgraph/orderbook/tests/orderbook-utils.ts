import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BuyOrderCreated,
  SellOrderCreated
} from "../generated/Orderbook/Orderbook"

export function createBuyOrderCreatedEvent(
  id: Bytes,
  creator: Address,
  tokenAddress: Address,
  tokenId: BigInt,
  amount: BigInt
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

  return buyOrderCreatedEvent
}

export function createSellOrderCreatedEvent(
  id: Bytes,
  creator: Address,
  tokenAddress: Address,
  tokenId: BigInt,
  amount: BigInt
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

  return sellOrderCreatedEvent
}
