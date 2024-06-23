import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const OffChainMarketModule = buildModule('OffChainMarketModule', m => {
	const offmarket = m.contract('OffChainMarket')

	return { offmarket }
})

export default OffChainMarketModule
