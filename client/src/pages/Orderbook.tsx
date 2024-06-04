import { Box, Typography } from '@mui/material'
import { useAccount } from 'wagmi'
import { moralisApi } from '../config'
import { Root } from '../types'
import { useEffect, useState } from 'react'
import { Loader } from '../components/Loader'

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

	return <Box></Box>
}
