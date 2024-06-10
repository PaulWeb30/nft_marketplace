import React, { useEffect, useState } from 'react'
import { Nft } from './Nft'
import { moralisApi } from '../config'
import { formatEther } from 'viem'
import { SellOrderCreated } from '../types'
import { Box, Typography } from '@mui/material'

export const OrderbookItem: React.FC<{
	order: SellOrderCreated
}> = ({ order }) => {
	const [name, setName] = useState<string>('')
	const [tokenURI, setTokenURI] = useState<string>('')

	useEffect(() => {
		const getNftMetadata = async () => {
			const response = await fetch(
				`${moralisApi}/nft/${order.tokenAddress}/0xaa36a7/${order.tokenId}`
			)

			const data = await response.json()
			setName(data.result?.name)
			setTokenURI(data.result?.token_uri)
		}

		getNftMetadata()
	}, [])

	return (
		<Box>
			<Nft name={name} img={tokenURI} />
			<Typography variant='h6' gutterBottom>
				Amount - {Number(order.amount)}
			</Typography>
			<Typography variant='h6' gutterBottom>
				PricePerOne - {formatEther(order.pricePerOne)} eth
			</Typography>
			<Typography variant='h6'>
				Order status {order.isClosed ? 'closed' : 'active'}
			</Typography>
			<Box sx={{ my: 3 }}>
				<Typography variant='h6'>Creator {order.creator}</Typography>
			</Box>
		</Box>
	)
}
