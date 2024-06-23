import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import { config } from './wagmi.ts'

import './index.css'
import { Proposals } from './pages/Proposals.tsx'
import { Orders } from './pages/Orders.tsx'
import { Nfts } from './pages/Nfts.tsx'
import { Erc1155Items } from './pages/Erc1155Items.tsx'
import { Orderbook } from './pages/Orderbook.tsx'
import { OffChainOrders } from './pages/OffChainOrders.tsx'

globalThis.Buffer = Buffer

const queryClient = new QueryClient()

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/nfts',
		element: <Nfts />,
	},
	{
		path: '/orders',
		element: <Orders />,
	},
	{
		path: '/proposals',
		element: <Proposals />,
	},
	{
		path: '/erc1155',
		element: <Erc1155Items />,
	},
	{
		path: '/orderbook',
		element: <Orderbook />,
	},
	{
		path: '/offchain',
		element: <OffChainOrders />,
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>
)
