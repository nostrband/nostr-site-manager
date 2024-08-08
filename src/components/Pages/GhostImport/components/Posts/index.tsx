import { FC, useEffect, useRef, useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { Post } from '../../types'
import { ItemPost } from './ItemPost'

type PostsProps = {
	posts: Post[]
	onImport: (selectedPosts: Post[]) => void
}

export const Posts: FC<PostsProps> = ({ posts, onImport }) => {
	const [selectedPosts, setSelectedPosts] = useState<Post[]>([])
	const selectAllRef = useRef<HTMLInputElement | null>(null)

	const handleSelectPost = (checkedPost: Post) => {
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

	useEffect(() => {
		const isAllSelected = selectedPosts.length === posts.length
		const isSomeSelected =
			selectedPosts.length > 0 && selectedPosts.length < posts.length

		if (selectAllRef.current) {
			selectAllRef.current.checked = isAllSelected
			selectAllRef.current.indeterminate = isSomeSelected
		}
	}, [selectedPosts, posts.length])

	const handleImportPosts = () => {
		if (!selectedPosts.length) return
		onImport(selectedPosts)
	}

	return (
		<Stack gap={'1rem'}>
			<Stack alignSelf={'end'} direction={'row'} gap={'0.5rem'}>
				<label htmlFor='select-all'>Select All</label>
				<input
					id='select-all'
					type='checkbox'
					ref={selectAllRef}
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
