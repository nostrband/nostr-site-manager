import { HeadingNode, HeadingTagType } from "@lexical/rich-text";
import { LexicalNode, NodeKey } from "lexical";

export class ExtendedHeadingNode extends HeadingNode {
  constructor(tag: HeadingTagType, key?: NodeKey) {
    super(tag, key);
  }
  static getType(): string {
    return "extended-heading";
  }

  static clone(node: ExtendedHeadingNode): ExtendedHeadingNode {
    return new ExtendedHeadingNode(node.__tag, node.__key);
  }
}

export function $createExtendedHeadingNode(
  headingTag: HeadingTagType,
): ExtendedHeadingNode {
  return new ExtendedHeadingNode(headingTag);
}

export function $isExtendedHeadingNode(
  node: LexicalNode | null | undefined,
): node is ExtendedHeadingNode {
  return node instanceof ExtendedHeadingNode;
}
