import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Buy,
  OrderCreated,
  OwnershipTransferred,
  ProposalCanceled,
  ProposalCreated,
  ProposalSelected
} from "../generated/Market/Market"

export function createBuyEvent(
  orderId: BigInt,
  buyer: Address,
  tokenId: BigInt,
  price: BigInt
): Buy {
  let buyEvent = changetype<Buy>(newMockEvent())

  buyEvent.parameters = new Array()

  buyEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return buyEvent
}

export function createOrderCreatedEvent(
  orderId: BigInt,
  creator: Address,
  price: BigInt,
  nft: Address,
  tokenId: BigInt
): OrderCreated {
  let orderCreatedEvent = changetype<OrderCreated>(newMockEvent())

  orderCreatedEvent.parameters = new Array()

  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return orderCreatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createProposalCanceledEvent(
  proposeId: BigInt,
  proposer: Address,
  proposedPrice: BigInt,
  nft: Address,
  tokenId: BigInt,
  nftOwner: Address,
  orderId: BigInt
): ProposalCanceled {
  let proposalCanceledEvent = changetype<ProposalCanceled>(newMockEvent())

  proposalCanceledEvent.parameters = new Array()

  proposalCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "proposeId",
      ethereum.Value.fromUnsignedBigInt(proposeId)
    )
  )
  proposalCanceledEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )
  proposalCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "proposedPrice",
      ethereum.Value.fromUnsignedBigInt(proposedPrice)
    )
  )
  proposalCanceledEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  proposalCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  proposalCanceledEvent.parameters.push(
    new ethereum.EventParam("nftOwner", ethereum.Value.fromAddress(nftOwner))
  )
  proposalCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )

  return proposalCanceledEvent
}

export function createProposalCreatedEvent(
  proposeId: BigInt,
  proposer: Address,
  proposedPrice: BigInt,
  nft: Address,
  tokenId: BigInt,
  nftOwner: Address,
  orderId: BigInt
): ProposalCreated {
  let proposalCreatedEvent = changetype<ProposalCreated>(newMockEvent())

  proposalCreatedEvent.parameters = new Array()

  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "proposeId",
      ethereum.Value.fromUnsignedBigInt(proposeId)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "proposedPrice",
      ethereum.Value.fromUnsignedBigInt(proposedPrice)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam("nftOwner", ethereum.Value.fromAddress(nftOwner))
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )

  return proposalCreatedEvent
}

export function createProposalSelectedEvent(
  proposeId: BigInt,
  proposer: Address,
  proposedPrice: BigInt,
  nft: Address,
  tokenId: BigInt,
  nftOwner: Address,
  orderId: BigInt
): ProposalSelected {
  let proposalSelectedEvent = changetype<ProposalSelected>(newMockEvent())

  proposalSelectedEvent.parameters = new Array()

  proposalSelectedEvent.parameters.push(
    new ethereum.EventParam(
      "proposeId",
      ethereum.Value.fromUnsignedBigInt(proposeId)
    )
  )
  proposalSelectedEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )
  proposalSelectedEvent.parameters.push(
    new ethereum.EventParam(
      "proposedPrice",
      ethereum.Value.fromUnsignedBigInt(proposedPrice)
    )
  )
  proposalSelectedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  proposalSelectedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  proposalSelectedEvent.parameters.push(
    new ethereum.EventParam("nftOwner", ethereum.Value.fromAddress(nftOwner))
  )
  proposalSelectedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )

  return proposalSelectedEvent
}
