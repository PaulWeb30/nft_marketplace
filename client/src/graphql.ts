import { gql } from 'graphql-request'

export const MARKET_QUERY = gql`
	query MarketQuery {
		buys(first: 5) {
			id
			orderId
			buyer
			tokenId
		}
		orderCreateds(first: 5) {
			id
			orderId
			creator
			price
			nft
			tokenId
		}
		proposalCreateds(first: 10) {
			id
			nft
			proposeId
			proposedPrice
			proposer
			tokenId
		}
	}
`

export const ORDERS_QUERY = gql`
	query OrdersQuery {
		orderCreateds(first: 10) {
			id
			orderId
			creator
			price
			isClosed
			nft
			tokenId
		}
	}
`

export const PROPOSALS_QUERY = gql`
	query OrdersQuery {
		proposalCreateds(first: 10) {
			id
			isClosed
			isOrderClosed
			nft
			nftOwner
			proposeId
			proposedPrice
			proposer
			tokenId
		}
	}
`
