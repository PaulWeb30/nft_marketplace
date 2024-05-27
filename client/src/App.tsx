import { sepolia } from 'viem/chains'
import { useWriteContract, usePublicClient } from 'wagmi'
import { nft_abi } from './abi/nft'

import Button from '@mui/material/Button'
import { Layout } from './components/Layout'

function App() {
	const pc = usePublicClient()
	const { writeContractAsync } = useWriteContract()

	const mintNft = async () => {
		const txHash = await writeContractAsync({
			chainId: sepolia.id,
			address: '0x86B247580E09AB23c388d640c2e325Cf26B5d44d',
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

	return (
		<Layout>
			<Button variant='contained' color='primary' onClick={mintNft}>
				Mint NFT
			</Button>
		</Layout>
	)
}

export default App
