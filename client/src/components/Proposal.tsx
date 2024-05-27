import React, { useEffect, useState } from 'react'
import { sepolia } from 'viem/chains'
import { usePublicClient, useWriteContract } from 'wagmi'
import { market_abi } from '../abi/market'
import { Nft } from './Nft'
import { market_address, moralisApi } from '../config'
import { formatEther } from 'viem'
import { ProposalCreated } from '../types'
import { Box, Button, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

export const Proposal: React.FC<{
	proposal: ProposalCreated
	isSelection?: boolean
}> = ({ proposal, isSelection = false }) => {
	const pc = usePublicClient()
	const queryClient = useQueryClient()

	const { writeContractAsync, error } = useWriteContract()
	const [name, setName] = useState<string>('')
	const [tokenURI, setTokenURI] = useState<string>('')

	useEffect(() => {
		const getNftMetadata = async () => {
			const response = await fetch(
				`${moralisApi}/nft/${proposal.nft}/0xaa36a7/${proposal.tokenId}`
			)

			const data = await response.json()
			setName(data.result?.name)
			setTokenURI(data.result?.token_uri)
		}

		getNftMetadata()
	}, [])

	const cancelProposal = async () => {
		const txHash = await writeContractAsync({
			chainId: sepolia.id,
			address: market_address,
			abi: market_abi,
			functionName: 'cancelProposal',
			args: [proposal.proposeId],
		})

		console.log('hash', txHash)

		const data = await pc.waitForTransactionReceipt({ hash: txHash })
		console.log('cancelProposal status', data.status)

		queryClient.invalidateQueries({ queryKey: ['proposals'] })
	}

	const selectProposal = async () => {
		const txHash = await writeContractAsync({
			chainId: sepolia.id,
			address: market_address,
			abi: market_abi,
			functionName: 'selectProposer',
			args: [proposal.proposeId],
		})

		console.log('hash', txHash)

		const data = await pc.waitForTransactionReceipt({ hash: txHash })
		console.log('selectProposal status', data.status)

		queryClient.invalidateQueries({ queryKey: ['proposals'] })
	}

	return (
		<Box>
			<Nft name={name} img={tokenURI} />
			<Typography variant='h6'>
				Price {formatEther(proposal.proposedPrice)} eth
			</Typography>
			<Typography variant='h6'>
				Proposal status {proposal.isClosed ? 'closed' : 'active'}
			</Typography>
			<Typography variant='h6'>
				Order status {proposal.isOrderClosed ? 'closed' : 'active'}
			</Typography>
			<Box sx={{ my: 3 }}>
				{isSelection && (
					<Typography variant='h6'>Proposer {proposal.proposer}</Typography>
				)}

				{isSelection ? (
					<Button
						variant='contained'
						onClick={selectProposal}
						disabled={proposal.isOrderClosed}
					>
						Select proposer
					</Button>
				) : (
					<Button
						variant='contained'
						onClick={cancelProposal}
						disabled={proposal.isClosed}
					>
						Cancel Proposal
					</Button>
				)}
				<Typography>{error && error.message}</Typography>
			</Box>
		</Box>
	)
}
