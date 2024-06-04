import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'

describe('MarketPlace', function () {
	async function deployOrderbookFixture() {
		const [owner, otherAccount] = await hre.viem.getWalletClients()

		const orderbook = await hre.viem.deployContract('Orderbook')

		const gameItems = await hre.viem.deployContract('GameItems')

		const publicClient = await hre.viem.getPublicClient()

		// minting tokens for acc
		await gameItems.write.mint([otherAccount.account.address, 0n, 10n])
		// approval for sell & buy orders
		await gameItems.write.setApprovalForAll([orderbook.address, true])
		await gameItems.write.setApprovalForAll([orderbook.address, true], {
			account: otherAccount.account,
		})

		return {
			orderbook,
			gameItems,
			owner,
			otherAccount,
			publicClient,
		}
	}

	describe('Ordebook Deployment', function () {
		it('Should mint tokens successfully', async function () {
			const { gameItems, owner } = await loadFixture(deployOrderbookFixture)

			const b = await gameItems.read.balanceOf([owner.account.address, 0n])

			expect(Number(b)).to.be.greaterThanOrEqual(777)
		})
		it('Should сreate buy order successfully', async function () {
			const { gameItems, orderbook, owner, publicClient } = await loadFixture(
				deployOrderbookFixture
			)

			await gameItems.write.setApprovalForAll([orderbook.address, true])

			const balanceBeforePurchase = Number(
				await publicClient.getBalance({
					address: owner.account.address,
				})
			)

			const insertionId = await orderbook.read.generateId([
				gameItems.address,
				0n,
				10n,
				100n,
				owner.account.address,
			])

			await orderbook.write.createBuyOrder(
				[
					0n,
					gameItems.address,
					10n,
					100n,
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				],
				{ value: 1000n }
			)

			const listHead = await orderbook.read.getBuyHead()

			expect(listHead).to.be.equal(insertionId)
		})

		it('Should сreate sell order successfully', async function () {
			const { gameItems, orderbook, owner, publicClient } = await loadFixture(
				deployOrderbookFixture
			)

			await gameItems.write.setApprovalForAll([orderbook.address, true])

			const insertionId = await orderbook.read.generateId([
				gameItems.address,
				0n,
				3n,
				500n,
				owner.account.address,
			])

			await orderbook.write.createSellOrder([
				0n,
				gameItems.address,
				3n,
				500n,
				'0x0000000000000000000000000000000000000000000000000000000000000000',
			])

			const listHead = await orderbook.read.getSellHead()

			expect(listHead).to.be.equal(insertionId)
		})

		it('Should reproduce order logic b3<=>s3', async function () {
			const { gameItems, orderbook, owner, publicClient, otherAccount } =
				await loadFixture(deployOrderbookFixture)

			const balanceBeforePurchase = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			const tokensBalanceBeforeOther = await gameItems.read.balanceOf([
				otherAccount.account.address,
				0n,
			])

			const tokensBalanceBeforeOwner = await gameItems.read.balanceOf([
				owner.account.address,
				0n,
			])

			await orderbook.write.createSellOrder(
				[
					0n,
					gameItems.address,
					3n,
					80n,
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				],
				{ account: otherAccount.account }
			)

			await orderbook.write.createBuyOrder(
				[
					0n,
					gameItems.address,
					3n,
					100n,
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				],
				{ value: 1000n }
			)

			const tokensBalanceAfterOther = await gameItems.read.balanceOf([
				otherAccount.account.address,
				0n,
			])

			const tokensBalanceAfterOwner = await gameItems.read.balanceOf([
				owner.account.address,
				0n,
			])

			const balanceAfterPurchase = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			expect(Number(tokensBalanceBeforeOther)).to.be.greaterThan(
				Number(tokensBalanceAfterOther)
			)

			expect(Number(tokensBalanceBeforeOwner)).to.be.lessThan(
				Number(tokensBalanceAfterOwner)
			)
		})

		it('Should reproduce order logic b3<=>s2', async function () {
			const { gameItems, orderbook, owner, publicClient, otherAccount } =
				await loadFixture(deployOrderbookFixture)

			const balanceBeforePurchase = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			const tokensBalanceBeforeOther = await gameItems.read.balanceOf([
				otherAccount.account.address,
				0n,
			])

			const tokensBalanceBeforeOwner = await gameItems.read.balanceOf([
				owner.account.address,
				0n,
			])

			await orderbook.write.createSellOrder(
				[
					0n,
					gameItems.address,
					2n,
					80n,
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				],
				{ account: otherAccount.account }
			)

			await orderbook.write.createBuyOrder(
				[
					0n,
					gameItems.address,
					3n,
					100n,
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				],
				{ value: 300n }
			)

			const tokensBalanceAfterOther = await gameItems.read.balanceOf([
				otherAccount.account.address,
				0n,
			])

			const tokensBalanceAfterOwner = await gameItems.read.balanceOf([
				owner.account.address,
				0n,
			])

			const balanceAfterPurchase = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			expect(await orderbook.read.getSellHead()).to.be.equal(
				'0x0000000000000000000000000000000000000000000000000000000000000000'
			)

			expect(Number(tokensBalanceBeforeOther)).to.be.greaterThan(
				Number(tokensBalanceAfterOther)
			)

			expect(Number(tokensBalanceBeforeOwner)).to.be.lessThan(
				Number(tokensBalanceAfterOwner)
			)
		})

		it('Should reproduce order logic b2<=>s3 => b1<=>s1', async function () {
			const { gameItems, orderbook, owner, publicClient, otherAccount } =
				await loadFixture(deployOrderbookFixture)

			const balanceBeforePurchase = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			const tokensBalanceBeforeOther = await gameItems.read.balanceOf([
				otherAccount.account.address,
				0n,
			])

			const tokensBalanceBeforeOwner = await gameItems.read.balanceOf([
				owner.account.address,
				0n,
			])

			await orderbook.write.createBuyOrder(
				[
					0n,
					gameItems.address,
					2n,
					100n,
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				],
				{ value: 200n }
			)

			await orderbook.write.createSellOrder(
				[
					0n,
					gameItems.address,
					3n,
					80n,
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				],
				{ account: otherAccount.account }
			)

			const tokensBalanceAfterOther = await gameItems.read.balanceOf([
				otherAccount.account.address,
				0n,
			])

			const tokensBalanceAfterOwner = await gameItems.read.balanceOf([
				owner.account.address,
				0n,
			])

			const balanceAfterPurchase = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			expect(await orderbook.read.getBuyHead()).to.be.equal(
				'0x0000000000000000000000000000000000000000000000000000000000000000'
			)

			expect(Number(tokensBalanceBeforeOther)).to.be.greaterThan(
				Number(tokensBalanceAfterOther)
			)

			expect(Number(tokensBalanceBeforeOwner)).to.be.lessThan(
				Number(tokensBalanceAfterOwner)
			)

			await orderbook.write.createBuyOrder(
				[
					0n,
					gameItems.address,
					1n,
					100n,
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				],
				{ value: 100n }
			)

			expect(await orderbook.read.getBuyHead()).to.be.equal(
				'0x0000000000000000000000000000000000000000000000000000000000000000'
			)

			expect(await orderbook.read.getSellHead()).to.be.equal(
				'0x0000000000000000000000000000000000000000000000000000000000000000'
			)
		})
	})
})
