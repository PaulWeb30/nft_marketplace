import React from 'react'
import { Card, CardMedia, CardContent, Typography } from '@mui/material'

export const Nft: React.FC<{ img: string; name: string }> = ({ img, name }) => {
	return (
		<Card sx={{ maxWidth: 345, my: 2 }}>
			<CardMedia component='img' height='auto' image={img} alt='nft image' />
			<CardContent>
				<Typography gutterBottom variant='h5' component='div'>
					{name}
				</Typography>
			</CardContent>
		</Card>
	)
}
