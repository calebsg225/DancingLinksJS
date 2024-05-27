type NodeType = 'header' | 'spacer' | 'item' | 'first';

type NodeTypes = {
  nodeType: NodeType;
  columnCount?: number;
  upNode?: number;
  downNode?: number;
  leftNode?: number;
  rightNode?: number;
  headerNode?: number;
}

class Node {
  nodeType: NodeType;
  upNode: number;
  downNode: number;
  constructor(upNode: number, downNode: number) {
    this.upNode = upNode;
    this.downNode = downNode;
  }
}

class FirstNode {
  leftNode: number;
  rightNode: number;
  nodeType: NodeType;
  constructor(rightNode: number, leftNode: number) {
    this.rightNode = rightNode;
    this.leftNode = leftNode;
    this.nodeType = 'spacer';
  }
}

class ItemNode extends Node {
  headerNode: number;
  constructor(headerNode: number, ...args: ConstructorParameters<typeof Node>) {
    super(...args);
    this.nodeType = 'item';
    this.headerNode = headerNode;
  }
}
class SpacerNode extends Node {
  constructor(...args: ConstructorParameters<typeof Node>) {
    super(...args);
    this.nodeType = 'spacer';
  }
}

class HeaderNode extends Node {
  columnCount: number; // number of active item nodes in column
  leftNode: number;
  rightNode: number;
  constructor(leftNode: number, rightNode: number,...args: ConstructorParameters<typeof Node>) {
    super(...args);
    this.nodeType = 'header';
    this.columnCount = 0;
    this.leftNode = leftNode;
    this.rightNode = rightNode;
  }
}

export { Node, FirstNode, ItemNode, SpacerNode, HeaderNode, NodeTypes, NodeType };