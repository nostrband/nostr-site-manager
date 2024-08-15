import { ElementTransformer } from '@lexical/markdown'
import {
	$applyNodeReplacement,
	DOMExportOutput,
	ElementNode,
	LexicalEditor,
	LexicalNode,
	NodeKey,
	SerializedElementNode,
	Spread,
} from 'lexical'

export type SerializedHtmlNode = Spread<
	{
		type: 'html'
		version: 1
		html: string
	},
	SerializedElementNode
>

export class HtmlNode extends ElementNode {
	__html: string

	constructor(html: string, key?: NodeKey) {
		super(key)
		this.__html = html
	}

	static getType(): string {
		return 'html'
	}

	getHtml(): string {
		return this.getLatest().__html
	}

	setHtml(html: string): HtmlNode {
		const writable = this.getWritable()
		writable.__html = html
		return this
	}

	static clone(node: HtmlNode): HtmlNode {
		const newNode = new HtmlNode(node.__html, node.__key)
		return $applyNodeReplacement(newNode)
	}

	static importJSON(serializedNode: SerializedHtmlNode) {
		const { html } = serializedNode
		const node = $createHtmlNode(html)
		return node
	}

	exportDOM(editor: LexicalEditor): DOMExportOutput {
		const parser = new DOMParser()
		// @ts-ignore
		const element = parser.parseFromString(
			this.getHtml(),
			'text/html',
		) as HTMLElement
		return {
			element,
		}
	}

	exportJSON(): SerializedHtmlNode {
		return {
			...super.exportJSON(),
			type: 'html',
			version: 1,
			html: this.getHtml(),
		}
	}
}

export function $createHtmlNode(html: string): HtmlNode {
	return $applyNodeReplacement(new HtmlNode(html))
}

export function $isHtmlNode(
	node: LexicalNode | null | undefined,
): node is HtmlNode {
	return node instanceof HtmlNode
}

export const HTML_TRANSFORMER: ElementTransformer = {
	dependencies: [HtmlNode],
	export: (node: LexicalNode) => {
		if (!$isHtmlNode(node)) return null
		return node.getHtml()
	},
	regExp: /$/,
	replace: () => {},
	type: 'element',
}
