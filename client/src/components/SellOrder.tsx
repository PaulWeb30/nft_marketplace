import React, { useEffect, useState } from 'react'
import { sepolia } from 'viem/chains'
import { useAccount, usePublicClient, useWriteContract } from 'wagmi'
import { market_abi } from '../abi/market'
import { Nft } from './Nft'
import { market_address, moralisApi } from '../config'
import { formatEther, parseEther } from 'viem'
import { OrderCreated } from '../types'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

export const SellOrder: React.FC<{ order: OrderCreated }> = ({ order }) => {
	const queryClient = useQueryClient()
	const pc = usePublicClient()
	const { address } = useAccount()
	const { writeContractAsync } = useWriteContract()
	const [value, setValue] = useState<string>('0.00001')
	const [name, setName] = useState<string>('')
	const [tokenURI, setTokenURI] = useState<string>('')

	useEffect(() => {
		const getNftMetadata = async () => {
			const response = await fetch(
				`${moralisApi}/nft/${order.nft}/0xaa36a7/${order.tokenId}`
			)

			const data = await response.json()
			setName(data.result?.name)
			setTokenURI(data.result?.token_uri)
		}

		getNftMetadata()
	}, [])

	const buyHandler = async () => {
		const txHash = await writeContractAsync({
			chainId: sepolia.id,
			address: market_address,
			abi: market_abi,
			functionName: 'buy',
			args: [order.orderId],
			value: order.price,
		})

		console.log('hash', txHash)

		const data = await pc.waitForTransactionReceipt({ hash: txHash })
		console.log('buy status', data.status)

		queryClient.invalidateQueries({ queryKey: ['orders'] })
	}

	const createProposal = async () => {
		const price = parseEther(value)

		const txHash = await writeContractAsync({
			chainId: sepolia.id,
			address: market_address,
			abi: market_abi,
			functionName: 'createProposal',
			args: [order.orderId, price],
			value: price,
		})

		console.log('hash', txHash)

		const data = await pc.waitForTransactionReceipt({ hash: txHash })
		console.log('createProposal status', data.status)

		queryClient.invalidateQueries({ queryKey: ['proposals'] })
	}

	return (
		<Box>
			<TextField
				id='outlined-basic'
				label='Input your proposed price'
				variant='outlined'
				placeholder='Input nft price'
				value={value}
				onChange={e => setValue(e.target.value)}
			/>
			<Nft name={name} img={tokenURI} />
			<Typography variant='h6'>Price {formatEther(order.price)} eth</Typography>
			<Typography variant='h6'>Creator {order.creator}</Typography>
			{address?.toLocaleLowerCase() !== order.creator && (
				<Box sx={{ my: 3 }}>
					<Button variant='contained' onClick={buyHandler}>
						Buy nft
					</Button>
					<Button variant='contained' onClick={createProposal}>
						Create proposal
					</Button>
				</Box>
			)}
		</Box>
	)
}
