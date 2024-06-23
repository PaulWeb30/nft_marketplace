import React, { useState } from 'react'
import { OffOrder } from '../types'
import {
	useAccount,
	usePublicClient,
	useReadContract,
	useWriteContract,
} from 'wagmi'
import { Nft } from '../components/Nft'
import { Layout } from '../components/Layout'
import { formatEther } from 'viem'
import { offMarket_address, moralisApi } from '../config'
import { sepolia } from 'viem/chains'
import { offMarket_abi } from '../abi/offMarket'
import { Loader } from '../components/Loader'
import { Box, Button, Typography } from '@mui/material'

export const OffChainOrders = () => {
	const { address } = useAccount()
	const pc = usePublicClient()
	const { writeContractAsync } = useWriteContract()

	const [loading, setLoading] = useState<boolean>(false)
	const [orders, setOrders] = React.useState<OffOrder[] | null>(null)

	const getOffOrders = async () => {
		if (address) {
			const response = await fetch(`${moralisApi}/orders`)
			const data = await response.json()
			setOrders(data.orders)
			setLoading(false)
		}
	}

	React.useEffect(() => {
		getOffOrders()
	}, [address])

	const buy = async (order: OffOrder) => {
		const txHash = await writeContractAsync({
			chainId: sepolia.id,
			address: offMarket_address,
			abi: offMarket_abi,
			functionName: 'performBuy',
			args: [
				order.nftAddress,
				order.tokenId,
				order.price,
				order.nonce,
				order.signature,
			],
			value: order.price,
		})

		console.log('hash', txHash)

		const data = await pc.waitForTransactionReceipt({ hash: txHash })
		console.log('performBuy status', data.status)

		await fetch(`${moralisApi}/order/${order._id}`, { method: 'PATCH' })
	}

	if (loading) {
		return <Loader />
	}

	return (
		<Layout>
			<Typography variant='h3' gutterBottom>
				Your nfts
			</Typography>
			{orders?.length! > 0 ? (
				orders?.map(order => (
					<Box sx={{ mb: 3 }} key={order._id}>
						<Nft img={order.tokenUri} name={order.name} />
						<Typography variant='h6' color={'primary'}>
							Price - {formatEther(order.price)}eth
						</Typography>
						<Typography variant='h6' color={'primary'}>
							Status - {order.isClosed ? 'closed' : 'active'}
						</Typography>
						<Button
							variant='contained'
							onClick={() => buy(order)}
							disabled={order.isClosed}
						>
							Buy
						</Button>
					</Box>
				))
			) : (
				<Typography variant='h4' color={'primary'}>
					There are no orders
				</Typography>
			)}
		</Layout>
	)
}
