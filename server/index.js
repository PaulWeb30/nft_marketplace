require('dotenv').config()
const Moralis = require('moralis').default
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Order = require('./schema/Order')

const app = express()
const port = 4000

app.use(express.json())

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
			limit: 20,
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

app.get('/nft/metadata/:tokenId', async (req, res) => {
	const { tokenId } = req.params
	console.log(tokenId)
	fs.readFile(`./metadata/${tokenId}.json`, (err, json) => {
		console.log('JSON', json)
		let obj = JSON.parse(json)
		res.json(obj)
	})
})

app.use('/metadata', express.static('metadata'))

app.post('/order', async (req, res) => {
	const {
		tokenId,
		nonce,
		creator,
		nftAddress,
		signature,
		name,
		tokenUri,
		price,
	} = req.body

	try {
		const order = new Order({
			tokenId,
			nonce,
			creator,
			nftAddress,
			signature,
			tokenUri,
			name,
			price,
		})
		await order.save()

		return res.status(200).json({ order })
	} catch (e) {
		res.status(400).json({
			sucess: false,
			response: null,
			error: e,
		})
		console.error('Error happened', e)
	}
})

app.get('/orders', async (req, res) => {
	try {
		const orders = await Order.find()

		return res.status(200).json({ orders })
	} catch (e) {
		res.status(400).json({
			sucess: false,
			response: null,
			error: e,
		})
		console.error('Error happened', e)
	}
})

app.patch('/order/:id', async (req, res) => {
	try {
		const { id } = req.params
		const order = Order.findOne({ _id: id })

		const updatedOrder = await Order.findOneAndUpdate(
			{ _id: id },
			{ isClosed: true },
			{ new: true }
		)

		return res.status(200).json({ order: updatedOrder })
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
	try {
		await Moralis.start({
			apiKey: process.env.MORALIS_API_KEY,
		})

		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log('DB successfully started')

		app.listen(port, () => {
			console.log(`Marketplace server listening on port ${port}`)
		})
	} catch (e) {
		console.error('Server error', e.message)
	}
}

startServer()
