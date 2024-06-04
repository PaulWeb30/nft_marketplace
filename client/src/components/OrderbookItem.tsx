import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { parseEther } from 'viem'
import { gameItems_abi } from '../abi/gameItems'
import { localhost } from 'wagmi/chains'
import { useWriteContract, usePublicClient } from 'wagmi'
import { gameItems_address, orderbook_address } from '../config'
import { orderbook_abi } from '../abi/orderbook'
import { useQueryClient } from '@tanstack/react-query'

export const OrderbookItem = () => {
	const queryClient = useQueryClient()
	const pc = usePublicClient()
	const { writeContractAsync, error } = useWriteContract()
	const [value, setValue] = useState<string>('0.00063')
	const [amount, setAmount] = useState<string>('0')

	const createSellOrder = async (
		tokenId: bigint,
		nftAddress: `0x${string}`
	) => {
		const price = parseEther(value)

		const approveHash = await writeContractAsync({
			chainId: localhost.id,
			address: gameItems_address,
			abi: gameItems_abi,
			functionName: 'setApprovalForAll',
			args: [orderbook_address, true],
		})

		console.log('approve hash', approveHash)

		const approve = await pc.waitForTransactionReceipt({
			hash: approveHash,
		})

		console.log('approve status', approve.status)

		const txHash = await writeContractAsync({
			chainId: localhost.id,
			address: orderbook_address,
			abi: orderbook_abi,
			functionName: 'createBuyOrder',
			args: [0n, gameItems_address, BigInt(amount), price, gameItems_address],
			value: price * BigInt(amount),
		})

		console.log('hash', txHash)

		const data = await pc.waitForTransactionReceipt({ hash: txHash })
		console.log('createSellOrder status', data.status)

		queryClient.invalidateQueries({ queryKey: ['sellBooks'] })
	}

	const createBuyOrder = async () => {}

	return (
		<Box>
			<TextField
				id='outlined-basic'
				label='Input for how much you wanna sell/buy for 1 token'
				variant='outlined'
				placeholder='Input price for 1 token'
				value={value}
				onChange={e => setValue(e.target.value)}
			/>
			<TextField
				id='outlined-basic'
				label='Input amount of tokens you wanna sell/buy'
				variant='outlined'
				placeholder='Input amount'
				value={amount}
				onChange={e => setAmount(e.target.value)}
			/>
			<Button variant='contained' onClick={createBuyOrder}>
				Create buy order
			</Button>
			<Button variant='contained' onClick={createBuyOrder}>
				Create sell order
			</Button>
		</Box>
	)
}
