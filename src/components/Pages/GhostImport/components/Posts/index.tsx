import { FC, useState } from 'react'
import { Button, Checkbox, Stack, Typography } from '@mui/material'
import { ClientPost } from '../../types'
import { ItemPost } from './ItemPost'

type PostsProps = {
	posts: ClientPost[]
	onImport: (selectedPosts: ClientPost[]) => void
}

export const Posts: FC<PostsProps> = ({ posts, onImport }) => {
	const [selectedPosts, setSelectedPosts] = useState<ClientPost[]>([])

	const handleSelectPost = (checkedPost: ClientPost) => {
		setSelectedPosts((prevSelectedPosts) => {
			if (!prevSelectedPosts.find((post) => post.id === checkedPost.id)) {
				return [...prevSelectedPosts, checkedPost]
			}
			return prevSelectedPosts.filter(
				(post) => post.id !== checkedPost.id,
			)
		})
	}

	const handleSelectAll = (checked: boolean) => {
		if (checked) setSelectedPosts(posts)
		else setSelectedPosts([])
	}

	const handleImportPosts = () => {
		if (!selectedPosts.length) return
		onImport(selectedPosts)
	}

	if (!posts.length) {
		return (
			<Typography variant='h5' textAlign={'center'} mt={'1rem'}>
				No data
			</Typography>
		)
	}

	return (
		<Stack gap={'1rem'}>
			<Stack
				alignSelf={'end'}
				direction={'row'}
				gap={'0.5rem'}
				alignItems={'center'}
			>
				<label htmlFor='select-all'>Select All</label>
				<Checkbox
					id='select-all'
					checked={selectedPosts.length === posts.length}
					indeterminate={
						selectedPosts.length > 0 &&
						selectedPosts.length < posts.length
					}
					onChange={(e) => handleSelectAll(e.target.checked)}
				/>
			</Stack>

			<Stack gap={'1rem'}>
				{posts.map((post) => (
					<ItemPost
						{...post}
						checked={selectedPosts.some((p) => p.id === post.id)}
						key={post.id}
						onCheckboxChange={() => handleSelectPost(post)}
					/>
				))}
			</Stack>

			<Button
				variant='contained'
				onClick={handleImportPosts}
				disabled={!selectedPosts.length}
			>
				OK
			</Button>
		</Stack>
	)
}
