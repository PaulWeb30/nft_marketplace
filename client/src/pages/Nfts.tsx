import React, { useState } from 'react'
import { Root } from '../types'
import {
	useAccount,
	usePublicClient,
	useReadContract,
	useSignMessage,
	useWriteContract,
} from 'wagmi'
import { keccak256, encodePacked, toBytes } from 'viem'
import { Nft } from '../components/Nft'
import { Layout } from '../components/Layout'
import { parseEther } from 'viem'
import { market_abi } from '../abi/market'
import { market_address, moralisApi, offMarket_address } from '../config'
import { sepolia } from 'viem/chains'
import { nft_abi } from '../abi/nft'
import { Loader } from '../components/Loader'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { offMarket_abi } from '../abi/offMarket'

export const Nfts = () => {
	const queryClient = useQueryClient()
	const { address } = useAccount()
	const pc = usePublicClient()
	const { writeContractAsync } = useWriteContract()
	const { data: signMessageData, signMessageAsync } = useSignMessage()

	const [value, setValue] = useState<string>('0.00063')
	const [loading, setLoading] = useState<boolean>(true)
	const [nfts, setNfts] = React.useState<Root | null>(null)

	const { data: fee } = useReadContract({
		abi: market_abi,
		address: market_address,
		functionName: 'fee',
	})

	const { data: nonce } = useReadContract({
		abi: offMarket_abi,
		address: offMarket_address,
		functionName: 'nonce',
	})

	const getNfts = async () => {
		if (address) {
			const response = await fetch(`${moralisApi}/nfts/${address}/0xaa36a7`)
			const data = await response.json()
			setNfts(data.result)
			setLoading(false)
		}
	}

	React.useEffect(() => {
		getNfts()
	}, [address])

	const createOrder = async (tokenId: bigint, nftAddress: `0x${string}`) => {
		const price = parseEther(value)
		const feeToPay = (price * fee!) / BigInt(100)

		const approveHash = await writeContractAsync({
			chainId: sepolia.id,
			address: nftAddress,
			abi: nft_abi,
			functionName: 'approve',
			args: [market_address, tokenId],
		})

		console.log('approve hash', approveHash)

		const approve = await pc.waitForTransactionReceipt({
			hash: approveHash,
		})

		console.log('approve status', approve.status)

		const txHash = await writeContractAsync({
			chainId: sepolia.id,
			address: market_address,
			abi: market_abi,
			functionName: 'createSellOrder',
			args: [nftAddress, tokenId, price],
			value: feeToPay,
		})

		console.log('hash', txHash)

		const data = await pc.waitForTransactionReceipt({ hash: txHash })
		console.log('createSellOrder status', data.status)

		queryClient.invalidateQueries({ queryKey: ['orders'] })
	}

	const createOffOrder = async (
		tokenId: bigint,
		nftAddress: `0x${string}`,
		tokenUri: string,
		name: string
	) => {
		const price = parseEther(value)

		const approveHash = await writeContractAsync({
			chainId: sepolia.id,
			address: nftAddress,
			abi: nft_abi,
			functionName: 'approve',
			args: [offMarket_address, tokenId],
		})

		console.log('approve hash', approveHash)

		const approve = await pc.waitForTransactionReceipt({
			hash: approveHash,
		})

		console.log('approve status', approve.status)

		const messageHashKeccak = keccak256(
			encodePacked(
				['address', 'uint256', 'uint256', 'uint256'],
				[nftAddress, tokenId, price, nonce!]
			)
		)

		console.log('messageHashKeccak', messageHashKeccak)

		const signature = await signMessageAsync({
			message: { raw: toBytes(messageHashKeccak) },
		})

		console.log('BODY', {
			nonce: Number(nonce),
			tokenId: Number(tokenId),
			creator: address,
			nftAddress,
			signature,
			tokenUri,
			name,
			price: Number(price),
		})

		await fetch(`${moralisApi}/order`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				nonce: Number(nonce),
				tokenId: Number(tokenId),
				creator: address,
				nftAddress,
				signature,
				tokenUri,
				name,
				price: Number(price),
			}),
		})

		const txHash = await writeContractAsync({
			chainId: sepolia.id,
			address: offMarket_address,
			abi: offMarket_abi,
			functionName: 'increaseNonce',
		})

		console.log('hash', txHash)

		const data = await pc.waitForTransactionReceipt({ hash: txHash })
		console.log('increaseNonce status', data.status)
	}

	if (loading) {
		return <Loader />
	}

	return (
		<Layout>
			<TextField
				id='outlined-basic'
				label='Input for how much you want to sell for'
				variant='outlined'
				placeholder='Input nft price'
				value={value}
				onChange={e => setValue(e.target.value)}
			/>
			<Typography variant='h3' gutterBottom>
				Your nfts
			</Typography>
			{nfts?.result?.length! > 0 ? (
				nfts?.result.map(nft => (
					<Box
						sx={{ mb: 3 }}
						key={nft.token_hash + String(nft.block_number_minted)}
					>
						<Nft img={nft.token_uri} name={nft.name} />
						<Button
							variant='contained'
							onClick={() => createOrder(nft.token_id, nft.token_address)}
						>
							Create sell order
						</Button>
						<Button
							variant='contained'
							onClick={() =>
								createOffOrder(
									nft.token_id,
									nft.token_address,
									nft.token_uri,
									nft.name
								)
							}
						>
							Create off-sell order
						</Button>
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
