import { useQuery } from '@tanstack/react-query'
import request from 'graphql-request'
import { ORDERS_QUERY } from '../graphql'

import { OrderCreated } from '../types'
import { SellOrder } from '../components/SellOrder'
import { Layout } from '../components/Layout'
import { Loader } from '../components/Loader'
import { Typography } from '@mui/material'
import { subgraphApi } from '../config'

export const Orders = () => {
	const { data: orders, isLoading } = useQuery<{
		orderCreateds: OrderCreated[]
	}>({
		queryKey: ['orders'],
		queryFn: async () => request(subgraphApi, ORDERS_QUERY, { first: 10 }),
	})

	if (isLoading) return <Loader />

	return (
		<Layout>
			<Typography variant='h3' gutterBottom>
				Orders
			</Typography>
			{orders?.orderCreateds?.filter(order => !order.isClosed).length ? (
				orders?.orderCreateds
					?.filter(order => !order.isClosed)
					.map(order => <SellOrder key={order.id} order={order} />)
			) : (
				<Typography variant='h4' color='primary'>
					No active orders
				</Typography>
			)}
		</Layout>
	)
}
