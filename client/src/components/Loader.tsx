import CircularProgress from '@mui/material/CircularProgress'
import { Backdrop } from '@mui/material'

export const Loader = () => (
	<Backdrop sx={{ backgroundColor: '#fff', color: 'blue', zIndex: 20 }} open>
		<CircularProgress color='inherit' />
	</Backdrop>
)
