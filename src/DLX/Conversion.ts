
type NodeType = 'header' | 'spacer' | 'item' | 'first';

type NodeTypes = {
  nodeType?: NodeType;
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
    this.nodeType = 'first';
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

class Convert {

  fromMatrix = (matrix: (0|1)[][]) => {
    if (!this.verifyMatrix(matrix)) return false;

    const colCount = matrix[0].length; // number of columns in the initial matrix
    const rowCount = matrix.length; // number of rows in the initial matrix

    const nodes: NodeTypes[] = [];

    // create first node
    nodes.push(new FirstNode(1, colCount));

    // create header nodes, each pointing to themselves in the up and down direction
    for (let i = 1; i <= colCount; i++) {
      nodes.push(new HeaderNode(i-1, i === colCount ? 0 : i+1, i, i));
    }

    // create the rest of the relevant nodes, i.e. spacer and item nodes
    for (let i = 0; i < rowCount; i++) {
      // create new spacer node pointing to itself in all directions
      nodes.push(new SpacerNode(nodes.length, nodes.length));
      const spacerIndex = nodes.length - 1;
      for (let j = 0; j < colCount; j++) {
        if (!matrix[i][j]) continue; // skip if value is 0
        nodes[spacerIndex].downNode = nodes.length; // update spacer pointer

        nodes[nodes[j+1].upNode].downNode = nodes.length; // update header down pointer
        nodes[j+1].upNode = nodes.length; // update header up pointer
        nodes[j+1].columnCount++; // increase header column count
        
        nodes.push(new ItemNode(j+1, nodes[j+1].upNode, j+1)); // add new item node to nodes array
      }
    }
  }

  private verifyMatrix = (matrix: (0|1)[][]): boolean => {
    if (!matrix.length) return false;
    const control = matrix[0].length;
    for (const row of matrix) {
      if (row.length !== control) {return false}
    }
    return true;
  }

}

export default new Convert;