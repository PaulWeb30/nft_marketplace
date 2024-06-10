import { useQuery } from '@tanstack/react-query'
import { BuyOrderCreated, SellOrderCreated } from '../types'
import { OREDERBOOK_BUYS_QUERY, OREDERBOOK_SELLS_QUERY } from '../graphql'
import {
	gameItems_address,
	orderbook_address,
	subgraphOrderbookApi,
} from '../config'
import request from 'graphql-request'
import { Loader } from '../components/Loader'
import { Box, Typography } from '@mui/material'
import { Layout } from '../components/Layout'
import { OrderbookItem } from '../components/OrderbookItem'
import { useReadContract } from 'wagmi'
import { sepolia } from 'viem/chains'
import { orderbook_abi } from '../abi/orderbook'

export const Orderbook = () => {
	const { data: buyHead } = useReadContract({
		chainId: sepolia.id,
		address: orderbook_address,
		abi: orderbook_abi,
		functionName: 'getBuyHead',
	})

	console.log('buyHead', buyHead)

	const { data: sellHead } = useReadContract({
		chainId: sepolia.id,
		address: orderbook_address,
		abi: orderbook_abi,
		functionName: 'getSellHead',
	})

	console.log('sellHead', sellHead)
	const { data: sellOrders, isLoading } = useQuery<{
		sellOrderCreateds: SellOrderCreated[]
	}>({
		queryKey: ['sellOrders'],
		queryFn: async () =>
			request(subgraphOrderbookApi, OREDERBOOK_SELLS_QUERY, { first: 10 }),
	})

	console.log('sell orders', sellOrders)

	const { data: buyOrders, isLoading: buyLoading } = useQuery<{
		buyOrderCreateds: BuyOrderCreated[]
	}>({
		queryKey: ['buyOrders'],
		queryFn: async () =>
			request(subgraphOrderbookApi, OREDERBOOK_BUYS_QUERY, { first: 10 }),
	})

	console.log('buy orders', buyOrders)

	if (buyLoading || isLoading) return <Loader />

	return (
		<Layout>
			<Typography variant='h2' gutterBottom sx={{ textAlign: 'center' }}>
				OrderBook
			</Typography>
			<Box
				sx={{
					display: 'flex',

					gap: '30px',
					justifyContent: 'space-between',
				}}
			>
				<Box>
					<Typography variant='h4' gutterBottom>
						Buy orders
					</Typography>
					{buyOrders?.buyOrderCreateds?.length! > 0 ? (
						buyOrders?.buyOrderCreateds
							?.filter(e => !e.isClosed)
							.map(bOrder => (
								<Box sx={{ mb: 3 }} key={bOrder.id}>
									<OrderbookItem order={bOrder} />
								</Box>
							))
					) : (
						<Typography variant='h4' color={'primary'}>
							No buy orders at the moment
						</Typography>
					)}
				</Box>
				<Box>
					<Typography variant='h4' gutterBottom>
						Sell orders
					</Typography>
					{sellOrders?.sellOrderCreateds?.length! > 0 ? (
						sellOrders?.sellOrderCreateds
							?.filter(e => !e.isClosed)
							?.map(sOrder => (
								<Box sx={{ mb: 3 }} key={sOrder.id}>
									<OrderbookItem order={sOrder} />
								</Box>
							))
					) : (
						<Typography variant='h4' color={'primary'}>
							No sell orders at the moment
						</Typography>
					)}
				</Box>
			</Box>
		</Layout>
	)
}
