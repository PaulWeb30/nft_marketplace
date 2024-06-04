import {
	loadFixture,
} from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'
import { parseEther, encodeAbiParameters, parseAbiParameters } from 'viem'

describe('MarketPlace', function () {
	async function deployContractsFixture() {
		const [owner, otherAccount] = await hre.viem.getWalletClients()

		const market = await hre.viem.deployContract('Market')
		const nft = await hre.viem.deployContract('ReyvelNFT')

		const publicClient = await hre.viem.getPublicClient()

		await nft.write.mint([
			owner.account.address,
			'https://img-cdn.magiceden.dev/rs:fill:128:0:0/plain/https://ord-mirror.magiceden.dev/content/e79134080a83fe3e0e06ed6990c5a9b63b362313341745707a2bff7d788a1375i0',
		])

		await nft.write.mint([
			owner.account.address,
			'https://img-cdn.magiceden.dev/rs:fill:128:0:0/plain/https://ord-mirror.magiceden.dev/content/e79134080a83fe3e0e06ed6990c5a9b63b362313341745707a2bff7d788a1375i0',
		])

		return {
			market,
			nft,
			owner,
			otherAccount,
			publicClient,
		}
	}

	describe('Deployment', function () {
		it('Nft should mint successfully', async function () {
			const { nft, owner } = await loadFixture(deployContractsFixture)

			expect(await nft.read.balanceOf([owner.account.address])).to.be.equal(2n)

			await nft.write.mint([
				owner.account.address,
				'https://img-cdn.magiceden.dev/rs:fill:128:0:0/plain/https://ord-mirror.magiceden.dev/content/e79134080a83fe3e0e06ed6990c5a9b63b362313341745707a2bff7d788a1375i0',
			])

			expect(await nft.read.balanceOf([owner.account.address])).to.be.equal(3n)
		})

		it('Should create order successfully', async function () {
			const { market, nft, owner, otherAccount, publicClient } =
				await loadFixture(deployContractsFixture)

			await market.write.createSellOrder([nft.address, 0n, 1000n], {
				value: 100n,
			})
		})

		it('Should buy nft successfully', async function () {
			const { market, nft, otherAccount, publicClient, owner } =
				await loadFixture(deployContractsFixture)

			const ownerBalanceBefore = Number(
				await publicClient.getBalance({
					address: owner.account.address,
				})
			)

			const PRICE = parseEther('1')

			const balanceBeforePurchase = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			expect(
				await nft.read.balanceOf([otherAccount.account.address])
			).to.be.equal(0n)

			await nft.write.approve([market.address, 0n])

			await market.write.createSellOrder([nft.address, 0n, PRICE], {
				value: parseEther('0.1'),
				account: owner.account.address,
			})

			const orderId = await market.read.generateId([
				nft.address,
				0n,
				PRICE,
				owner.account.address,
			])

			await market.write.buy([orderId], {
				value: PRICE,
				account: otherAccount.account.address,
			})

			expect(
				await nft.read.balanceOf([otherAccount.account.address])
			).to.be.equal(1n)

			const balanceAfterPurchase = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			const ownerBalanceAfter = Number(
				await publicClient.getBalance({
					address: owner.account.address,
				})
			)

			expect(balanceBeforePurchase).be.greaterThan(balanceAfterPurchase)
			expect(ownerBalanceBefore).be.lessThan(ownerBalanceAfter)
		})

		it('Should create proposal successfully', async function () {
			const { market, nft, owner, otherAccount, publicClient } =
				await loadFixture(deployContractsFixture)

			const marketBalanceBefore = Number(
				await publicClient.getBalance({
					address: market.address,
				})
			)

			const PRICE = parseEther('1')
			const PROPOSED_PRICE = parseEther('0.1')

			await nft.write.approve([market.address, 0n])

			await market.write.createSellOrder([nft.address, 0n, PRICE], {
				value: parseEther('0.1'),
				account: owner.account.address,
			})

			const orderId = await market.read.generateId([
				nft.address,
				0n,
				PRICE,
				owner.account.address,
			])

			await market.write.createProposal([orderId, PROPOSED_PRICE], {
				value: PROPOSED_PRICE,
			})

			const marketBalanceAfter = Number(
				await publicClient.getBalance({
					address: market.address,
				})
			)

			expect(marketBalanceBefore).be.lessThan(marketBalanceAfter)
		})

		it('Should cancel proposal successfully', async function () {
			const { market, nft, owner, otherAccount, publicClient } =
				await loadFixture(deployContractsFixture)

			const PRICE = parseEther('1')
			const PROPOSED_PRICE = parseEther('0.1')

			await nft.write.approve([market.address, 0n])

			await market.write.createSellOrder([nft.address, 0n, PRICE], {
				value: parseEther('0.1'),
				account: owner.account.address,
			})

			const orderId = await market.read.generateId([
				nft.address,
				0n,
				PRICE,
				owner.account.address,
			])

			await expect(
				market.write.createProposal([orderId, PROPOSED_PRICE], {
					value: PROPOSED_PRICE,
					account: otherAccount.account,
				})
			).to.be.not.rejected

			const balanceBefore = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			const proposalId = await market.read.generateId([
				nft.address,
				0n,
				PROPOSED_PRICE,
				otherAccount.account.address,
			])

			await market.write.cancelProposal([proposalId], {
				account: otherAccount.account,
			})

			const balanceAfter = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			expect(balanceBefore).be.lessThan(balanceAfter)
		})

		it('Should select proposer successfully', async function () {
			const { market, nft, otherAccount, publicClient, owner } =
				await loadFixture(deployContractsFixture)

			const ownerBalanceBefore = Number(
				await publicClient.getBalance({
					address: owner.account.address,
				})
			)

			const PRICE = parseEther('10')
			const PROPOSED_PRICE = parseEther('3')

			const balanceBeforePurchase = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			expect(
				await nft.read.balanceOf([otherAccount.account.address])
			).to.be.equal(0n)

			await nft.write.approve([market.address, 0n])

			await market.write.createSellOrder([nft.address, 0n, PRICE], {
				value: parseEther('1'),
				account: owner.account.address,
			})

			const orderId = await market.read.generateId([
				nft.address,
				0n,
				PRICE,
				owner.account.address,
			])

			await market.write.createProposal([orderId, PROPOSED_PRICE], {
				value: PROPOSED_PRICE,
				account: otherAccount.account,
			})

			const proposalId = await market.read.generateId([
				nft.address,
				0n,
				PROPOSED_PRICE,
				otherAccount.account.address,
			])

			await market.write.selectProposer([proposalId], {
				account: owner.account.address,
			})

			expect(
				await nft.read.balanceOf([otherAccount.account.address])
			).to.be.equal(1n)

			const balanceAfterPurchase = Number(
				await publicClient.getBalance({
					address: otherAccount.account.address,
				})
			)

			const ownerBalanceAfter = Number(
				await publicClient.getBalance({
					address: owner.account.address,
				})
			)

			expect(balanceBeforePurchase).be.greaterThan(balanceAfterPurchase)
			expect(ownerBalanceBefore).be.lessThan(ownerBalanceAfter)
		})
	})
})
