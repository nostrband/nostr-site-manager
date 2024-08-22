import { ElementTransformer } from '@lexical/markdown'
import {
	$applyNodeReplacement,
	ElementNode,
	LexicalNode,
	NodeKey,
	SerializedElementNode,
	Spread,
} from 'lexical'

type BookmarkMetadata = {
	icon: string
	title: string
	description: string
	author: null
	publisher: string
	thumbnail: string
}

export type SerializedBookmarkNode = Spread<
	{
		type: 'bookmark'
		version: 1
		url: string
		metadata: BookmarkMetadata
		caption: string
	},
	SerializedElementNode
>

export class BookmarkNode extends ElementNode {
	__url: string
	__caption: string
	__metadata: BookmarkMetadata

	constructor(
		url: string,
		caption: string,
		metadata: BookmarkMetadata,
		key?: NodeKey,
	) {
		super(key)
		this.__url = url
		this.__caption = caption
		this.__metadata = metadata
	}

	static getType(): string {
		return 'bookmark'
	}

	static clone(node: BookmarkNode): BookmarkNode {
		const newNode = new BookmarkNode(
			node.__url,
			node.__caption,
			node.__metadata,
			node.__key,
		)
		return $applyNodeReplacement(newNode)
	}

	static importJSON(serializedNode: SerializedBookmarkNode) {
		const { caption, url, metadata } = serializedNode
		const node = $createBookmarkNode(url, caption, metadata)
		return node
	}
}

export function $createBookmarkNode(
	url: string,
	caption: string,
	metadata: BookmarkMetadata,
): BookmarkNode {
	return $applyNodeReplacement(new BookmarkNode(url, caption, metadata))
}

export function $isBookmarkNode(
	node: LexicalNode | null | undefined,
): node is BookmarkNode {
	return node instanceof BookmarkNode
}

export const BOOKMARK_TRANSFORMER: ElementTransformer = {
	dependencies: [BookmarkNode],
	export: (node: LexicalNode) => {
		if (!$isBookmarkNode(node)) return null
		return `[${node.__metadata.title}](${node.__url})

![${node.__metadata.title}](${node.__metadata.thumbnail})

${node.__metadata.description}

*Publisher: ${node.__metadata.publisher}*`
	},
	regExp: /$/,
	replace: () => {},
	type: 'element',
}
