import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const OrderbookModule = buildModule('OrderbookModule', m => {
	const orderbook = m.contract('Orderbook')

	return { orderbook }
})

export default OrderbookModule
