import { QuoteNode } from '@lexical/rich-text'
import { LexicalNode, NodeKey } from 'lexical'

export class ExtendedQuoteNode extends QuoteNode {
	constructor(key?: NodeKey) {
		super(key)
	}
	static getType(): string {
		return 'extended-quote'
	}

	static clone(node: ExtendedQuoteNode): ExtendedQuoteNode {
		return new ExtendedQuoteNode(node.__key)
	}
}

export function $createExtendedQuoteNode(): ExtendedQuoteNode {
	return new ExtendedQuoteNode()
}

export function $isExtendedQuoteNode(
	node: LexicalNode | null | undefined,
): node is ExtendedQuoteNode {
	return node instanceof ExtendedQuoteNode
}
