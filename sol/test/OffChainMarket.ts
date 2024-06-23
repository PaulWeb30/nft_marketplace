import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'
import {
	parseEther,
	encodeAbiParameters,
	parseAbiParameters,
	encodePacked,
	keccak256,
	recoverMessageAddress,
	verifyMessage,
	toBytes,
} from 'viem'
// import keccak256 from 'keccak256'

describe('OffCHainMarket', function () {
	async function deployContractsFixture() {
		const [owner, otherAccount] = await hre.viem.getWalletClients()

		const offmarket = await hre.viem.deployContract('OffChainMarket')
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
			offmarket,
			nft,
			owner,
			otherAccount,
			publicClient,
		}
	}

	describe('Deployment', function () {
		it('Should reject buy performing', async function () {
			const { offmarket, nft, otherAccount, publicClient, owner } =
				await loadFixture(deployContractsFixture)

			const PRICE = parseEther('0.00001')

			await nft.write.approve([offmarket.address, 0n])

			const messageHashKeccak = keccak256(
				encodePacked(
					['address', 'uint256', 'uint256', 'uint256'],
					[nft.address, 0n, PRICE, 1n]
				)
			)

			const signature = await owner.signMessage({
				account: otherAccount.account,
				message: { raw: toBytes(messageHashKeccak) },
			})

			// rejected because signature was created with another DATA & signer
			await expect(
				offmarket.write.performBuy([nft.address, 0n, PRICE, 1n, signature], {
					value: parseEther('0.1'),
					account: otherAccount.account.address,
				})
			).to.be.rejectedWith('Order creator is not nft owner')
		})

		it('Should successfully reproduce buy functionality', async function () {
			const { offmarket, nft, otherAccount, owner } = await loadFixture(
				deployContractsFixture
			)

			const PRICE = parseEther('0.00001')

			await nft.write.approve([offmarket.address, 0n])

			const messageHashKeccak = keccak256(
				encodePacked(
					['address', 'uint256', 'uint256', 'uint256'],
					[nft.address, 0n, PRICE, 1n]
				)
			)

			const signature = await owner.signMessage({
				account: owner.account,
				message: { raw: toBytes(messageHashKeccak) },
			})

			console.log('signature', signature)

			const valid = await verifyMessage({
				address: owner.account.address,
				message: { raw: toBytes(messageHashKeccak) },
				signature,
			})

			expect(valid).to.be.true

			const address = await recoverMessageAddress({
				message: { raw: toBytes(messageHashKeccak) },
				signature,
			})

			console.log('signature signer', address)

			await offmarket.write.performBuy(
				[nft.address, 0n, PRICE, 1n, signature],
				{
					value: parseEther('0.1'),
					account: otherAccount.account.address,
				}
			)

			await expect(
				offmarket.write.performBuy([nft.address, 0n, PRICE, 1n, signature], {
					value: parseEther('0.1'),
					account: otherAccount.account.address,
				})
			).to.be.rejectedWith('Signature is already used')
		})

		it('Should return correct nonce', async function () {
			const { offmarket, nft, otherAccount, publicClient, owner } =
				await loadFixture(deployContractsFixture)

			await offmarket.write.increaseNonce()

			expect(Number(await offmarket.read.nonce())).to.be.greaterThan(0)
		})
	})
})
