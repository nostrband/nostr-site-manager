import React, { FC } from 'react'
import { ClientPost } from '../../types'
import { Avatar, Box, Checkbox, Stack, Typography } from '@mui/material'
import { capitalizeFirstLetter } from '../../utils'
import Link from 'next/link'

type ItemProps = ClientPost & {
	checked: boolean
	onCheckboxChange: () => void
}

export const ItemPost: FC<ItemProps> = ({
	title,
	plaintext,
	summary,
	onCheckboxChange,
	checked,
	published_at,
	tags,
	author,
	url
}) => {
	const { name, profile_image = '' } = author || {}
	const nameFirstLetter = (name || '').charAt(0).toUpperCase()
	const hasTags = tags.length > 0
	const renderedTags = tags.map((tag) => `#${tag.slug}`).join(' ')

	return (
		<Stack direction={'row'} gap={'1rem'}>
			<Stack alignItems={'center'}>
				<Avatar src={profile_image || ''}>{nameFirstLetter}</Avatar>
				<Typography
					width={'75%'}
					variant='subtitle1'
					textAlign={'center'}
				>
					{capitalizeFirstLetter(name || '')}
				</Typography>
			</Stack>

			<Stack flex={1} gap={'0.5rem'}>
				<Typography fontWeight={600}>{title}</Typography>
				<Typography variant='body2'>
					{summary || 'N/A'}
				</Typography>
				<Typography variant='subtitle2' color={'GrayText'}>
					{published_at &&
						new Date(published_at).toLocaleDateString()}
				</Typography>
				{hasTags && (
					<Typography variant='body2'>{renderedTags}</Typography>
				)}
				{url && (
					<Link href={url} target='_blank'>Already published</Link>
				)}
			</Stack>

			<Box alignSelf={'center'}>
				<Checkbox checked={checked} onChange={onCheckboxChange} />
			</Box>
		</Stack>
	)
}
