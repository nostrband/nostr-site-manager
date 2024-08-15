import { LexicalNode, NodeKey, TextNode } from 'lexical'

export class ExtendedTextNode extends TextNode {
	constructor(text: string, key?: NodeKey) {
		super(text, key)
	}

	static getType(): string {
		return 'extended-text'
	}

	static clone(node: ExtendedTextNode): ExtendedTextNode {
		return new ExtendedTextNode(node.__text, node.__key)
	}
}

export function $createExtendedTextNode(text: string): ExtendedTextNode {
	return new ExtendedTextNode(text)
}

export function $isExtendedTextNode(
	node: LexicalNode | null | undefined,
): node is ExtendedTextNode {
	return node instanceof ExtendedTextNode
}
