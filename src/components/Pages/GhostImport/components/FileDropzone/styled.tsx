import { Box, styled } from '@mui/material'
import { blue } from '@mui/material/colors'

export const StyledDropzoneContainer = styled(Box)(() => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	border: '1px solid #EFEFEF',
	borderRadius: '10px',
	padding: '1.5rem 1rem',
	transition: 'all 0.3s ease-in-out',
	'&:hover': {
		background: '#fbfbfb',
	},
}))

export const StyledText = styled('span')(() => ({
	color: blue[700],
	cursor: 'pointer',
	transition: 'all 0.3s ease-in-out',
	'&:hover': {
		textDecoration: 'underline',
	},
}))
