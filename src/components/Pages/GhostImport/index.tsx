import React, { useCallback, useState } from 'react'
import { HeaderOnboarding } from '@/components/HeaderOnboarding'
import { Box, Container } from '@mui/material'
import { StyledTitle } from './styled'
import { FileDropzone } from './components/FileDropzone'
import { SpinerCircularProgress, SpinerWrap } from '@/components/Spiner'
import { Posts } from './components/Posts'
import { JSONDataReturnType, Post } from './types'
import { useSnackbar } from 'notistack'

export const GhostImport = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [posts, setPosts] = useState<Post[] | undefined>()

	const { enqueueSnackbar } = useSnackbar()

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			setIsLoading(true)

			const [file] = acceptedFiles
			const reader = new FileReader()
			const handleLoadFile = () => {
				try {
					const fileAsString = reader.result as string
					const result: JSONDataReturnType = JSON.parse(fileAsString)
					if (!result.db || !result.db.length) return

					const [config] = result.db
					setPosts(config.data.posts)
					setIsLoading(false)
				} catch (e: any) {
					enqueueSnackbar('Error: ' + e.toString(), {
						autoHideDuration: 3000,
						variant: 'error',
						anchorOrigin: {
							horizontal: 'right',
							vertical: 'top',
						},
					})
					setIsLoading(false)
				}
			}
			reader.onload = handleLoadFile
			reader.readAsText(file)
		},
		[enqueueSnackbar],
	)

	const handleImportPosts = (posts: Post[]) => {
		console.log(posts)
	}

	return (
		<Box sx={{ paddingBottom: '50px' }}>
			<HeaderOnboarding />

			<Container maxWidth='lg'>
				<StyledTitle variant='h2'>Import from Ghost</StyledTitle>
				<Box sx={{ maxWidth: '600px', margin: '40px auto' }}>
					{!posts && <FileDropzone onDrop={onDrop} />}

					{isLoading && (
						<SpinerWrap>
							<SpinerCircularProgress />
						</SpinerWrap>
					)}
					{posts && !isLoading && (
						<Posts posts={posts} onImport={handleImportPosts} />
					)}
				</Box>
			</Container>
		</Box>
	)
}
