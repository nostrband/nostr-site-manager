import React, { FC } from 'react'
import { Post } from '../../types'
import { Stack, Typography } from '@mui/material'

type ItemProps = Post & {
	checked: boolean
	onCheckboxChange: () => void
}

export const ItemPost: FC<ItemProps> = ({
	title,
	plaintext,
	onCheckboxChange,
	checked,
}) => {
	return (
		<Stack direction={'row'}>
			<Stack flex={1}>
				<Typography fontWeight={600}>{title}</Typography>
				<Typography variant='body2'>
					{plaintext.trim().substring(0, 100) || 'N/A'}
				</Typography>
			</Stack>
			<input
				type='checkbox'
				checked={checked}
				onChange={onCheckboxChange}
			/>
		</Stack>
	)
}
