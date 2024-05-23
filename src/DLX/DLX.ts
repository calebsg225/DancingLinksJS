import MinHeap from "../utils/MinHeap";
import { HeaderNode, NodeTypes } from "../type/NodeTypes";

class DancingLinks {
  private activeColumns: Set<number>;
  private instructionStack: number[]; // keep track of covering order. To reverse, unstack.
  private nodes: NodeTypes[];
  private colCount: number;
  private currentSolution: number[];
  private solutions: [];
  constructor() {
  }

  test = (stringToConvert: string): number => {
    return +stringToConvert;
  }

  // covers an inputed item
  private coverItem = (headerItemToCover: number) => {
    const header = this.nodes[headerItemToCover];
    let p = header.downNode;
    while (p != headerItemToCover) {
      this.hide(p);
      this.nodes[p].downNode;
    }
    const l = header.leftNode;
    const r = header.rightNode;
    header.rightNode = l;
    header.leftNode = r;
    this.activeColumns.delete(headerItemToCover);
  }

  // uncovers an inputed item
  private uncoverItem = () => {}

  // hides all nodes on the same option level as the inputed node from their respective items
  private hide = (nodeToHide: number) => {
    const node = this.nodes[nodeToHide];
    
  }

  // unhides all nodes of a given option level
  private unhide = () => {}

  private search = () => {
  }

  private getMinCol = (): number => {
    let minOptionCountIndex = 1;
    this.activeColumns.forEach((activeItem) => {
      if (this.nodes[activeItem].columnCount < this.nodes[minOptionCountIndex].columnCount) {
        minOptionCountIndex = activeItem;
      }
    });
    return minOptionCountIndex;
  }

  private reset = () => {
    this.colCount = 0;
    this.instructionStack = [];
    this.activeColumns = new Set();
    this.nodes = [];
    this.currentSolution = [];
    this.solutions = [];
  }

  private setup = () => {
    this.colCount = this.nodes[0].leftNode;
    this.activeColumns = new Set(Array.from(Array(this.colCount), (_, i) => i + 1));
  }

  // find all possible solutions to exact cover problem
  findAll = (nodes: NodeTypes[]) => {
    this.nodes = nodes;
    this.reset();
  }

  // find one possible solution to exact cover problem
  findOne = (nodes: NodeTypes[]) => {
    this.nodes = nodes;
    this.reset();
    const curItemIndex = this.getMinCol();
    while (!this.solutions.length) {
      const curOptionRow = this.nodes[curItemIndex].downNode;
      this.search();
    }
  }

}

export default new DancingLinks;