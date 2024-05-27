import request from 'graphql-request'
import { useQuery } from '@tanstack/react-query'
import { ProposalCreated } from '../types'
import { PROPOSALS_QUERY } from '../graphql'
import { Layout } from '../components/Layout'
import { useAccount } from 'wagmi'
import { Typography } from '@mui/material'
import { Loader } from '../components/Loader'
import { Proposal } from '../components/Proposal'
import { subgraphApi } from '../config'

export const Proposals = () => {
	const { address } = useAccount()

	const { data: proposals, isLoading } = useQuery<{
		proposalCreateds: ProposalCreated[]
	}>({
		queryKey: ['proposals'],
		queryFn: async () => request(subgraphApi, PROPOSALS_QUERY, { first: 10 }),
	})

	if (isLoading) return <Loader />

	return (
		<Layout>
			<Typography variant='h3' gutterBottom>
				Proposals for your orders
			</Typography>
			{proposals?.proposalCreateds.length ? (
				proposals?.proposalCreateds
					?.filter(
						proposal =>
							proposal.nftOwner === address?.toLocaleLowerCase() &&
							!proposal.isOrderClosed &&
							!proposal.isClosed
					)
					.map(proposal => (
						<Proposal key={proposal.id} proposal={proposal} isSelection />
					))
			) : (
				<Typography variant='h4' color='primary'>
					No proposals for you
				</Typography>
			)}

			<Typography variant='h3' gutterBottom>
				Your proposals
			</Typography>
			{proposals?.proposalCreateds.length ? (
				proposals?.proposalCreateds
					?.filter(
						proposal =>
							proposal.proposer === address?.toLocaleLowerCase() &&
							!proposal.isClosed
					)
					.map(proposal => <Proposal key={proposal.id} proposal={proposal} />)
			) : (
				<Typography variant='h4' color='primary'>
					You didn't create any proposals
				</Typography>
			)}
		</Layout>
	)
}
