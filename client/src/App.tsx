import { sepolia } from 'viem/chains'
import { useWriteContract, usePublicClient, useSignMessage } from 'wagmi'
import { nft_abi } from './abi/nft'

import Button from '@mui/material/Button'
import { Layout } from './components/Layout'
import { nft_address } from './config'
import { recoverMessageAddress } from 'viem'

function App() {
	const pc = usePublicClient()
	const { writeContractAsync } = useWriteContract()
	const {
		data: signMessageData,
		error,
		signMessage,
		variables,
	} = useSignMessage()

	const mintNft = async () => {
		const txHash = await writeContractAsync({
			chainId: sepolia.id,
			address: nft_address,
			abi: nft_abi,
			functionName: 'mint',
			account: '0xBae119015934E3C8FeB3063aaCB0949Ba4116aFd',
			args: [
				'0xBae119015934E3C8FeB3063aaCB0949Ba4116aFd',
				'https://img-cdn.magiceden.dev/rs:fill:128:0:0/plain/https://ord-mirror.magiceden.dev/content/e79134080a83fe3e0e06ed6990c5a9b63b362313341745707a2bff7d788a1375i0',
			],
		})

		const data = await pc.waitForTransactionReceipt({ hash: txHash })
		console.log('mintNft status', data.status)
	}

	const getSigner = async () => {
		if (variables?.message && signMessageData) {
			const recoveredAddress = await recoverMessageAddress({
				message: variables?.message,
				signature: signMessageData,
			})
			console.log(recoveredAddress)
		}
	}
	return (
		<Layout>
			<Button variant='contained' color='primary' onClick={mintNft}>
				Mint NFT
			</Button>
			<Button
				variant='contained'
				color='primary'
				onClick={() =>
					signMessage({ message: 'I certify that I am nft owner' })
				}
			>
				create signature
			</Button>
			<p>signature {signMessageData}</p>
			<Button onClick={getSigner}>get signer</Button>
		</Layout>
	)
}

export default App
