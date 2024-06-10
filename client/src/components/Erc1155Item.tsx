import { Box, Button, TextField, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { parseEther } from 'viem'
import { gameItems_abi } from '../abi/gameItems'
import { localhost, sepolia } from 'wagmi/chains'
import { useWriteContract, usePublicClient, useAccount } from 'wagmi'
import { readContract } from '@wagmi/core'
import {
	gameItems_address,
	orderbook_address,
	subgraphOrderbookApi,
} from '../config'
import { orderbook_abi } from '../abi/orderbook'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BuyOrderCreated, Result, SellOrderCreated } from '../types'
import { Nft } from './Nft'
import { selectInsertionId } from '../utils/selectInsertionId'
import { OREDERBOOK_BUYS_QUERY, OREDERBOOK_SELLS_QUERY } from '../graphql'
import request from 'graphql-request'
import { config } from '../wagmi'

export const Erc1155Item: FC<{ nft: Result }> = ({ nft }) => {
	let insertAfterId: `0x${string}` =
		'0x0000000000000000000000000000000000000000000000000000000000000000'
	const queryClient = useQueryClient()
	const { address } = useAccount()
	const pc = usePublicClient()
	const { writeContractAsync, error } = useWriteContract()
	const [value, setValue] = useState<string>('0.00063')
	const [amount, setAmount] = useState<string>('0')

	const { data: sellOrders } = useQuery<{
		sellOrderCreateds: SellOrderCreated[]
	}>({
		queryKey: ['sellOrders'],
		queryFn: async () =>
			request(subgraphOrderbookApi, OREDERBOOK_SELLS_QUERY, { first: 10 }),
	})

	const { data: buyOrders } = useQuery<{
		buyOrderCreateds: BuyOrderCreated[]
	}>({
		queryKey: ['buyOrders'],
		queryFn: async () =>
			request(subgraphOrderbookApi, OREDERBOOK_BUYS_QUERY, { first: 10 }),
	})
	const createSellOrder = async (
		tokenId: bigint,
		nftAddress: `0x${string}`
	) => {
		const price = parseEther(value)

		const isApproved = await readContract(config, {
			chainId: sepolia.id,
			address: nftAddress,
			abi: gameItems_abi,
			functionName: 'isApprovedForAll',
			args: [address!, orderbook_address],
		})

		if (!isApproved) {
			const approveHash = await writeContractAsync({
				chainId: sepolia.id,
				address: nftAddress,
				abi: gameItems_abi,
				functionName: 'setApprovalForAll',
				args: [orderbook_address, true],
			})

			console.log('approve hash', approveHash)

			const approve = await pc.waitForTransactionReceipt({
				hash: approveHash,
			})

			console.log('approve status', approve.status)
		}

		if (sellOrders) {
			insertAfterId = selectInsertionId(
				sellOrders.sellOrderCreateds,
				true,
				price
			)
		}

		console.log('INSERT AFTER ID', insertAfterId)

		const txHash = await writeContractAsync({
			chainId: sepolia.id,
			address: orderbook_address,
			abi: orderbook_abi,
			functionName: 'createSellOrder',
			args: [tokenId, nftAddress, BigInt(amount), price, insertAfterId],
		})

		console.log('hash', txHash)

		const data = await pc.waitForTransactionReceipt({ hash: txHash })
		console.log('createSellOrder status', data.status)

		queryClient.invalidateQueries({ queryKey: ['sellOrders'] })
	}

	const createBuyOrder = async (tokenId: bigint, nftAddress: `0x${string}`) => {
		const price = parseEther(value)
		console.log(address, nftAddress)
		const isApproved = await readContract(config, {
			chainId: sepolia.id,
			address: nftAddress,
			abi: gameItems_abi,
			functionName: 'isApprovedForAll',
			args: [address!, orderbook_address],
		})
		console.log('is approved', isApproved)
		if (!isApproved) {
			const approveHash = await writeContractAsync({
				chainId: sepolia.id,
				address: nftAddress,
				abi: gameItems_abi,
				functionName: 'setApprovalForAll',
				args: [orderbook_address, true],
			})

			console.log('approve hash', approveHash)

			const approve = await pc.waitForTransactionReceipt({
				hash: approveHash,
			})

			console.log('approve status', approve.status)
		}

		// Off-chain calculation
		if (buyOrders) {
			insertAfterId = selectInsertionId(
				buyOrders.buyOrderCreateds,
				false,
				price
			)
		}

		console.log('INSERT AFTER ID', insertAfterId)

		const txHash = await writeContractAsync({
			chainId: sepolia.id,
			address: orderbook_address,
			abi: orderbook_abi,
			functionName: 'createBuyOrder',
			args: [tokenId, nftAddress, BigInt(amount), price, insertAfterId],
			value: price * BigInt(amount),
		})

		console.log('hash', txHash)

		const data = await pc.waitForTransactionReceipt({ hash: txHash })
		console.log('createBuyOrder status', data.status)

		queryClient.invalidateQueries({ queryKey: ['buyOrders'] })
	}

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
			<Nft img={nft.token_uri} name={nft.name} />
			<Typography variant='h4' color={'primary'}>
				{nft.amount}
			</Typography>
			<Typography variant='h4' color={'primary'}>
				TokenId - {Number(nft.token_id)}
			</Typography>
			<Button
				variant='contained'
				onClick={() => createSellOrder(nft.token_id, nft.token_address)}
			>
				Create sell order
			</Button>
			<Button
				variant='contained'
				onClick={() => createBuyOrder(nft.token_id, nft.token_address)}
			>
				Create buy order
			</Button>
		</Box>
	)
}
