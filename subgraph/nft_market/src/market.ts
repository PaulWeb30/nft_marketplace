import {
	Buy as BuyEvent,
	OrderCreated as OrderCreatedEvent,
	OwnershipTransferred as OwnershipTransferredEvent,
	ProposalCanceled as ProposalCanceledEvent,
	ProposalCreated as ProposalCreatedEvent,
	ProposalSelected as ProposalSelectedEvent,
} from '../generated/Market/Market'

import {
	Buy,
	OrderCreated,
	OwnershipTransferred,
	ProposalCanceled,
	ProposalCreated,
	ProposalSelected,
} from '../generated/schema'

export function handleBuy(event: BuyEvent): void {
	let entity = new Buy(event.transaction.hash.concatI32(event.logIndex.toI32()))
	entity.orderId = event.params.orderId
	entity.buyer = event.params.buyer
	entity.tokenId = event.params.tokenId
	entity.price = event.params.price

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash

	let orderId = event.params.orderId.toString()
	let order = new OrderCreated(orderId)

	let proposals = order.proposals.load()

	for (let i = 0, k = proposals.length; i < k; ++i) {
		let proposeId = proposals[i].id
		let proposal = new ProposalCreated(proposeId)
		proposal.isOrderClosed = true

		proposal.save()
	}

	order.isClosed = true
	order.save()

	entity.save()
}

export function handleOrderCreated(event: OrderCreatedEvent): void {
	let orderId = event.params.orderId.toString()
	let entity = new OrderCreated(orderId)

	entity.orderId = event.params.orderId
	entity.creator = event.params.creator
	entity.price = event.params.price
	entity.nft = event.params.nft
	entity.tokenId = event.params.tokenId

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash
	entity.isClosed = false

	entity.save()
}

export function handleOwnershipTransferred(
	event: OwnershipTransferredEvent
): void {
	let entity = new OwnershipTransferred(
		event.transaction.hash.concatI32(event.logIndex.toI32())
	)
	entity.previousOwner = event.params.previousOwner
	entity.newOwner = event.params.newOwner

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash

	entity.save()
}

export function handleProposalCanceled(event: ProposalCanceledEvent): void {
	let entity = new ProposalCanceled(
		event.transaction.hash.concatI32(event.logIndex.toI32())
	)
	entity.proposeId = event.params.proposeId
	entity.proposer = event.params.proposer
	entity.proposedPrice = event.params.proposedPrice
	entity.nft = event.params.nft
	entity.tokenId = event.params.tokenId
	entity.nftOwner = event.params.nftOwner
	entity.orderId = event.params.orderId

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash

	let proposeId = event.params.proposeId.toString()
	let proposal = new ProposalCreated(proposeId)

	proposal.isClosed = true
	proposal.save()

	entity.save()
}

export function handleProposalCreated(event: ProposalCreatedEvent): void {
	let proposeId = event.params.proposeId.toString()
	let entity = new ProposalCreated(proposeId)

	entity.proposeId = event.params.proposeId
	entity.proposer = event.params.proposer
	entity.proposedPrice = event.params.proposedPrice
	entity.nft = event.params.nft
	entity.tokenId = event.params.tokenId
	entity.nftOwner = event.params.nftOwner
	entity.orderId = event.params.orderId

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash
	entity.isClosed = false
	entity.isOrderClosed = false

	let orderId = event.params.orderId.toString()
	let order = new OrderCreated(orderId)

	entity.order = orderId

	let orderProposals = order.proposals.load()
	orderProposals.push(entity)

	order.save()
	entity.save()
}

export function handleProposalSelected(event: ProposalSelectedEvent): void {
	let entity = new ProposalSelected(
		event.transaction.hash.concatI32(event.logIndex.toI32())
	)
	entity.proposeId = event.params.proposeId
	entity.proposer = event.params.proposer
	entity.proposedPrice = event.params.proposedPrice
	entity.nft = event.params.nft
	entity.tokenId = event.params.tokenId
	entity.nftOwner = event.params.nftOwner
	entity.orderId = event.params.orderId

	entity.blockNumber = event.block.number
	entity.blockTimestamp = event.block.timestamp
	entity.transactionHash = event.transaction.hash

	let orderId = event.params.orderId.toString()
	let order = new OrderCreated(orderId)
	order.isClosed = true

	let proposalToCloseId = event.params.proposeId.toString()
	let proposalToClose = new ProposalCreated(proposalToCloseId)
	proposalToClose.isClosed = true

	let proposals = order.proposals.load()

	for (let i = 0, k = proposals.length; i < k; ++i) {
		let proposalId = proposals[i].id
		let proposal = new ProposalCreated(proposalId)

		proposal.isOrderClosed = true

		proposal.save()
	}

	order.save()
	proposalToClose.save()
	entity.save()
}
