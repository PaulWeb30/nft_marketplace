import React from 'react'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Link } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export const Layout: React.FC<{
	children: React.ReactElement | React.ReactNode
}> = ({ children }) => {
	const account = useAccount()
	const { connectors, connect } = useConnect()
	const { disconnect } = useDisconnect()
	return (
		<>
			<AppBar component='nav' position='fixed'>
				<Toolbar>
					<Typography
						variant='h4'
						component='div'
						sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
					>
						NftBazar
					</Typography>
					<Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
						<Button sx={{ color: '#fff' }}>
							<Link to={'/nfts'}>Your nfts</Link>
						</Button>
						<Button sx={{ color: '#fff' }}>
							<Link to={'/proposals'}>Proposals</Link>
						</Button>
						<Button sx={{ color: '#fff' }}>
							<Link to={'/orders'}>Orders</Link>
						</Button>
						<Button sx={{ color: '#fff' }}>
							<Link to={'/orderbook'}>Orderbook</Link>
						</Button>
						{account.isConnected ? (
							<>
								<Typography variant='h6' color={'white'}>
									{account.address}
								</Typography>
								<Button
									sx={{ color: '#000', fontSize: '14' }}
									type='button'
									onClick={() => disconnect()}
								>
									Disconnect
								</Button>
							</>
						) : (
							<>
								{connectors.map(connector => (
									<Button
										sx={{ color: '#fff' }}
										key={connector.uid}
										onClick={() => connect({ connector })}
										type='button'
									>
										{connector.name}
									</Button>
								))}
							</>
						)}
					</Box>
				</Toolbar>
			</AppBar>

			<Box sx={{ paddingTop: 10 }}>{children}</Box>
		</>
	)
}
