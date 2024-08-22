import { useCallback, useContext, useState } from 'react'
import { HeaderOnboarding } from '@/components/HeaderOnboarding'
import { Box, Container, Typography } from '@mui/material'
import { StyledTitle } from './styled'
import { FileDropzone } from './components/FileDropzone'
import { SpinerCircularProgress, SpinerWrap } from '@/components/Spiner'
import { Posts } from './components/Posts'
import { JSONDataReturnType, ClientPost } from './types'
import { useSnackbar } from 'notistack'
import { createNostrEvent, preparePosts, updateUrls } from './utils'
import {
	AuthContext,
	DEFAULT_RELAYS,
	ndk,
	userProfile,
	userPubkey,
	userRelays,
} from '@/services/nostr/nostr'
import { nip19 } from 'nostr-tools'
import { NDKEvent, NDKRelaySet } from '@nostr-dev-kit/ndk'
import Link from 'next/link'

export const GhostImport = () => {
	const authed = useContext(AuthContext)
	const { enqueueSnackbar } = useSnackbar()

	const [isLoading, setIsLoading] = useState(false)
	const [isPending, setIsPending] = useState(false)
	const [posts, setPosts] = useState<ClientPost[] | undefined>()
	const [publishType, setPublishType] = useState<'long' | 'short'>('long')

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			setIsLoading(true)

			const [file] = acceptedFiles
			const reader = new FileReader()
			const handleLoadFile = async () => {
				try {
					const fileAsString = reader.result as string
					const result: JSONDataReturnType = JSON.parse(fileAsString)
					if (!result.db || !result.db.length) return
					const [data] = result.db
					const posts = preparePosts(data)
					if (authed) await updateUrls(posts)
					console.log('posts', posts)
					setPosts(posts)
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
		[enqueueSnackbar, authed, setIsLoading, setPosts],
	)

	const handleImportPosts = async (selectedPosts: ClientPost[]) => {
		setIsPending(true)
		// reset urls just for visual indication
		setPosts(
			posts!.map((p) =>
				selectedPosts.find((sp) => sp.id === p.id)
					? { ...p, url: '' }
					: p,
			),
		)

		const relays = userRelays.length ? userRelays : DEFAULT_RELAYS

		for (const post of selectedPosts) {
			const event = createNostrEvent(post, publishType)
			// @ts-ignore
			const signed: NostrEvent = await window.nostr.signEvent(event)
			console.log('signed', event)
			console.log('publishing to', relays)
			const r = await new NDKEvent(ndk, signed).publish(
				NDKRelaySet.fromRelayUrls(relays, ndk),
				10000,
			)
			console.log('published to', r.size)
			if (r.size) {
				post.url =
					'https://njump.me/' +
					nip19.neventEncode({
						id: signed.id,
						relays: [...r].map((r) => r.url),
					})
			} else {
				post.url = ''
			}

			// update urls
			setPosts(posts!.map((p) => (p.id === post.id ? { ...p } : p)))
		}
		setIsPending(false)
	}

	let username = undefined
	if (authed) {
		username = nip19.npubEncode(userPubkey).substring(0, 10) + '...'
		if (userProfile) {
			try {
				const meta = JSON.parse(userProfile.content)
				username = meta.display_name || meta.name || username
			} catch {}
		}
	}

	const handlePublishTypeChange = (type: 'long' | 'short') => {
		setPublishType(type)
	}

	return (
		<Box sx={{ paddingBottom: '50px' }}>
			<HeaderOnboarding />

			<Container maxWidth='lg'>
				<StyledTitle variant='h2'>Import from Ghost</StyledTitle>
				<Box sx={{ maxWidth: '600px', margin: '40px auto' }}>
					{(!posts || !posts.length) && (
						<>
							<StyledTitle variant='h6'>
								First,{' '}
								<Link
									href='https://ghost.org/help/exports/'
									target='_blank'
								>
									export your posts
								</Link>{' '}
								from Ghost, then:
							</StyledTitle>

							<FileDropzone onDrop={onDrop} />
							<Typography variant='body2' margin={'1rem'}>
								Your data will not be uploaded anywhere until
								you click <em>publish</em>, all processing will
								be done in your browser.
							</Typography>
						</>
					)}

					{isLoading && (
						<SpinerWrap>
							<SpinerCircularProgress />
						</SpinerWrap>
					)}
					{posts && !isLoading && (
						<>
							<Posts
								posts={posts}
								onImport={handleImportPosts}
								isPending={isPending}
								publishType={publishType}
								onPublishTypeChange={handlePublishTypeChange}
							/>
							<Typography variant='body2' margin={'1rem'}>
								{username && (
									<>
										You will publish as <b>{username}</b>
									</>
								)}
								{!username && (
									<>
										You will be prompted to login after you
										click Publish.
									</>
								)}
								<br />
								Re-publishing will update, not duplicate the
								posts.
								<br />
								You can edit posts after publishing using{' '}
								<Link
									href={'https://habla.news'}
									target='_blank'
								>
									Habla.news
								</Link>{' '}
								or other Nostr apps.
							</Typography>
						</>
					)}
				</Box>
			</Container>
		</Box>
	)
}
