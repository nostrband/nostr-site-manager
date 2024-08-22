import { createHeadlessEditor } from '@lexical/headless'
import { ClientPost, DBReturnType, Post, Tag } from '../types'
import { TRANSFORMERS, $convertToMarkdownString } from '@lexical/markdown'
import { LineBreakNode, ParagraphNode, TextNode } from 'lexical'
import { LinkNode } from '@lexical/link'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode.js'
import { ExtendedTextNode } from '../lexical/ExtendedText'
import { ExtendedHeadingNode } from '../lexical/ExtendedHeading'
import { ExtendedQuoteNode } from '../lexical/ExtendedQuote'
import { MARKDOWN_TRANSFORMER, MarkdownNode } from '../lexical/Markdown'
import { BOOKMARK_TRANSFORMER, BookmarkNode } from '../lexical/Bookmark'
import { HTML_TRANSFORMER, HtmlNode } from '../lexical/HtmlNode'
import {
	DEFAULT_RELAYS,
	ndk,
	userPubkey,
	userRelays,
} from '@/services/nostr/nostr'
import { fetchEvents, tv } from 'libnostrsite'
import { nip19 } from 'nostr-tools'

export const preparePosts = (db: DBReturnType): ClientPost[] => {
	const { posts, users, posts_authors, tags, posts_tags } = db.data

	return posts.map((post) => {
		post.published_at = post.published_at || post.created_at
		post.summary =
			post.custom_excerpt || post.plaintext.trim().substring(0, 100)

		const postAuthorRelation = posts_authors.find(
			(relation) => relation.post_id === post.id,
		)
		const author = postAuthorRelation
			? users.find((user) => user.id === postAuthorRelation.author_id)
			: undefined

		const postTagsRelations = posts_tags.filter(
			(relation) => relation.post_id === post.id,
		)
		const postTags = postTagsRelations
			.map((relation) => tags.find((tag) => tag.id === relation.tag_id))
			.filter((tag) => tag !== undefined) as Tag[]

		return {
			...post,
			author: author || undefined,
			tags: postTags,
			d_tag: post.slug + '_' + post.id,
		}
	})
}

export const capitalizeFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

const editorConfig = {
	nodes: [
		ParagraphNode,
		LinkNode,
		LineBreakNode,
		HorizontalRuleNode,
		TextNode,
		ExtendedTextNode,
		HeadingNode,
		ExtendedHeadingNode,
		QuoteNode,
		ExtendedQuoteNode,
		MarkdownNode,
		BookmarkNode,
		HtmlNode,
	],
}

const ALL_TRANSFORMERS = [
	MARKDOWN_TRANSFORMER,
	BOOKMARK_TRANSFORMER,
	HTML_TRANSFORMER,
	...TRANSFORMERS,
]

const convertPostLexicalToMarkdown = (lexical: string) => {
	try {
		const editor = createHeadlessEditor(editorConfig)
		const parsedEditorState = editor.parseEditorState(lexical)
		editor.setEditorState(parsedEditorState)
		const markdown = editor
			.getEditorState()
			.read(() => $convertToMarkdownString(ALL_TRANSFORMERS))

		return markdown
	} catch {
		return ''
	}
}

export const createNostrEvent = (
	post: ClientPost,
	publishType: 'long' | 'short',
) => {
	if (publishType === "short") throw new Error("Not supported");
	const timestamp = new Date(post.published_at).getTime()
	const unixTimestamp = Math.floor(timestamp / 1000)

	const event = {
		kind: publishType === 'long' ? 30023 : 1,
		content: convertPostLexicalToMarkdown(post.lexical),
		created_at: Math.floor(Date.now() / 1000),
		tags: [
			['d', post.d_tag],
			['published_at', unixTimestamp.toString()],
			['title', post.title],
			['summary', post.summary],
			['alt', 'Article: ' + post.title],
		],
	}
	if (post.feature_image) event.tags.push(['image', post.feature_image])
	for (const t of post.tags) {
		event.tags.push(['t', t.slug.toLocaleLowerCase()])
	}

	return event
}

export async function updateUrls(posts: ClientPost[], type: string) {
	console.log('updateUrls', posts)
	if (!posts || !posts.length) return

	const d_tags = []
	for (const p of posts) {
		d_tags.push(p.d_tag)
	}

	const relays = userRelays.length ? userRelays : DEFAULT_RELAYS
	console.log('d_tags', d_tags, 'relays', relays)
	const events = [
		...(await fetchEvents(
			ndk,
			{
				kinds: [type === "long" ? 30023 : 1],
				authors: [userPubkey],
				'#d': d_tags,
			},
			relays,
			1000,
		)),
	]
	console.log('post events', events)

	for (const p of posts) {
		const e = events.find((e) => tv(e, 'd') === p.d_tag)
		if (e) {
			const eventRelays = [...relays]
			if (e.relay) eventRelays.unshift(e.relay.url)
			if (relays.length > 3) eventRelays.length = 3
			p.url =
				'https://njump.me/' +
				nip19.neventEncode({
					id: e.id,
					relays: eventRelays,
				})
		} else {
			p.url = ''
		}
	}
}
