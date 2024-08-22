import { ElementTransformer } from '@lexical/markdown'
import {
	$applyNodeReplacement,
	$isElementNode,
	DecoratorNode,
	ElementNode,
	LexicalNode,
	NodeKey,
	SerializedElementNode,
	Spread,
} from 'lexical'

export type SerializedMarkdownNode = Spread<
	{
		markdown: string
		type: 'markdown'
		version: 1
	},
	SerializedElementNode
>

export class MarkdownNode extends ElementNode {
	__text: string

	constructor(markdown: string, key?: NodeKey) {
		super(key)
		this.__text = markdown
	}

	static getType(): string {
		return 'markdown'
	}

	static clone(node: MarkdownNode): MarkdownNode {
		const newNode = new MarkdownNode(node.__text, node.__key)
		return $applyNodeReplacement(newNode)
	}

	static importJSON(serializedNode: SerializedMarkdownNode) {
		const { markdown } = serializedNode
		const node = $createMarkdownNode(markdown)
		return node
	}
}

export function $createMarkdownNode(markdown: string): MarkdownNode {
	return $applyNodeReplacement(new MarkdownNode(markdown))
}

export function $isMarkdownNode(
	node: LexicalNode | null | undefined,
): node is MarkdownNode {
	return node instanceof MarkdownNode
}

const replaceWithBlock = (
	createNode: (match: Array<string>) => ElementNode | DecoratorNode<unknown>,
): ElementTransformer['replace'] => {
	return (parentNode, children, match) => {
		const node = createNode(match)
		if ($isElementNode(node)) node.append(...children)
		parentNode.replace(node)
		if ($isElementNode(node)) node.select(0, 0)
	}
}

export const MARKDOWN_TRANSFORMER: ElementTransformer = {
	dependencies: [MarkdownNode],
	export: (node: LexicalNode) => {
		if (!$isMarkdownNode(node)) return null
		return node.__text
	},
	regExp: /$/,
	replace: () => {},
	type: 'element',
}
