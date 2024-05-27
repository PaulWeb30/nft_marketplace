import { HardhatUserConfig, vars } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox-viem'

const SEPOLIA_API_KEY = vars.get('SEPOLIA_API_KEY') // 48fb50febf4a452fb301de31b6e5b716
const PRIVATE_KEY = vars.get('PRIVATE_KEY')

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.24',
		settings: {
			optimizer: {
				enabled: true,
				runs: 100,
			},
			viaIR: true,
		},
	},

	networks: {
		sepolia: {
			chainId: 11155111,
			url: `https://sepolia.infura.io/v3/${SEPOLIA_API_KEY}`,
			accounts: [`0x${PRIVATE_KEY}`],
		},
	},
}

export default config
