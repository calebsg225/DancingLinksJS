
type NodeType = 'header' | 'spacer' | 'item' | 'first';

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

    const nodes = [];

    // create first node
    nodes.push(new FirstNode(1, colCount));

    // create header nodes, each pointing to themselves in the up and down direction
    for (let i = 1; i <= colCount; i++) {
      nodes.push(new HeaderNode(i-1, i === colCount ? 0 : i+1, i, i));
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