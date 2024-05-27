require('dotenv').config()
const Moralis = require('moralis').default

const express = require('express')
const cors = require('cors')

const app = express()
const port = 4000

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
)

app.get('/nfts/:address/:chainId', async (req, res) => {
	const { address, chainId } = req.params
	try {
		if (!Moralis.Core.isStarted) {
			await Moralis.start({
				apiKey: MORALIS_API_KEY,
			})
		}
		const result = await Moralis.EvmApi.nft.getWalletNFTs({
			chain: chainId,
			format: 'decimal',
			mediaItems: false,
			limit: 10,
			address,
		})

		return res.status(200).json({ result })
	} catch (e) {
		res.status(400).json({
			sucess: false,
			response: null,
			error: e,
		})
		console.error('Error happened', e)
	}
})

app.get('/nft/:address/:chainId/:tokenId', async (req, res) => {
	const { address, chainId, tokenId } = req.params
	try {
		if (!Moralis.Core.isStarted) {
			await Moralis.start({
				apiKey: MORALIS_API_KEY,
			})
		}
		const result = await Moralis.EvmApi.nft.getNFTMetadata({
			address,
			chain: chainId,
			tokenId,
		})

		return res.status(200).json({ result })
	} catch (e) {
		res.status(400).json({
			sucess: false,
			response: null,
			error: e,
		})
		console.error('Error happened', e)
	}
})

const startServer = async () => {
	await Moralis.start({
		apiKey: process.env.MORALIS_API_KEY,
	})

	app.listen(port, () => {
		console.log(`Marketplace server listening on port ${port}`)
	})
}

startServer()
