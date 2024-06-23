const { Schema, model } = require('mongoose')

const OrderSchema = new Schema(
	{
		tokenId: {
			type: Number,
			required: true,
		},
		nonce: {
			type: Number,
			required: true,
		},
		creator: {
			type: String,
			required: true,
		},
		nftAddress: {
			type: String,
			required: true,
		},
		signature: {
			type: String,
			required: true,
		},
		isClosed: {
			type: Boolean,
			default: false,
		},
		tokenUri: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

module.exports = model('Order', OrderSchema)
