import { Box, Button, Typography } from '@mui/material'
import { useAccount } from 'wagmi'
import { moralisApi } from '../config'
import { Root } from '../types'
import { useEffect, useState } from 'react'
import { Loader } from '../components/Loader'
import { OrderbookItem } from '../components/OrderbookItem'
import { Layout } from '../components/Layout'

export const Orderbook = () => {
	const { address } = useAccount()
	const [loading, setLoading] = useState<boolean>(true)
	const [nfts, setNfts] = useState<Root | null>(null)

	const getNfts = async () => {
		if (address) {
			const response = await fetch(`${moralisApi}/nfts/${address}/0xaa36a7`)
			const data = await response.json()
			setNfts(data.result)
			setLoading(false)
		}
	}

	useEffect(() => {
		getNfts()
	}, [address])

	if (loading) {
		return <Loader />
	}

	return (
		<Layout>
			<Typography variant='h3' gutterBottom>
				Your nfts
			</Typography>
			{nfts?.result?.length! > 0 ? (
				nfts?.result
					.filter(nft => Number(nft.amount) > 1)
					.map(nft => (
						<Box
							sx={{ mb: 3 }}
							key={nft.token_hash + String(nft.block_number_minted)}
						>
							<OrderbookItem nft={nft} />
						</Box>
					))
			) : (
				<Typography variant='h4' color={'primary'}>
					You don't have any nfts on Sepolia
				</Typography>
			)}
		</Layout>
	)
}
