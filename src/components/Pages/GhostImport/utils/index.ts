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

export const preparePosts = (db: DBReturnType): ClientPost[] => {
	const { posts, users, posts_authors, tags, posts_tags } = db.data

	return posts.map((post) => {
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

export const createNostrEvent = (post: Post) => {
	const timestamp = new Date(post.published_at).getTime()
	const unixTimestamp = Math.floor(timestamp / 1000)

	const event = {
		kind: 30023,
		content: convertPostLexicalToMarkdown(post.lexical),
		tags: [
			['d', post.slug + '_' + post.id],
			['published_at', unixTimestamp.toString()],
			['title', post.title],
			['summary', post.plaintext.trim().substring(0, 100)],
			['image', post.feature_image],
		],
	}

	return event
}
