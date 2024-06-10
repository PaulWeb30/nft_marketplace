import { SellOrderCreated } from '../types'

export function selectInsertionId(
	orders: SellOrderCreated[],
	sellOrder: boolean = true,
	pricePerOne: bigint
): `0x${string}` {
	let insertionId: `0x${string}` =
		'0x0000000000000000000000000000000000000000000000000000000000000000'
	if (!orders.length) return insertionId

	const filteredOrders = orders.filter(e => !e.isClosed)

	if (sellOrder) {
		sortArrayAsc(filteredOrders)
		console.log('Sorted arr asc', filteredOrders)
		for (let i = 0; i < filteredOrders.length; i++) {
			console.log(
				filteredOrders[i].pricePerOne,
				pricePerOne,
				filteredOrders[i].pricePerOne < pricePerOne
			)
			if (filteredOrders[i].pricePerOne < pricePerOne) {
				insertionId = filteredOrders[i].id
			}
		}
	} else {
		sortArrayDesc(filteredOrders)
		console.log('Sorted arr desc', filteredOrders)
		for (let i = 0; i < filteredOrders.length; i++) {
			if (filteredOrders[i].pricePerOne > pricePerOne) {
				insertionId = filteredOrders[i].id
			}
		}
	}

	return insertionId
}

function sortArrayAsc(orders: SellOrderCreated[]) {
	return orders.sort((a, b) => Number(a.pricePerOne) - Number(b.pricePerOne))
}

function sortArrayDesc(orders: SellOrderCreated[]) {
	return orders.sort((a, b) => Number(b.pricePerOne) - Number(a.pricePerOne))
}
