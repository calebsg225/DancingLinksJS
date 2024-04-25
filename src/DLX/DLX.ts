import MinHeap from "../utils/MinHeap";
import { NodeTypes } from "../type/NodeTypes";

class DancingLinks {
  private activeColumns: Set<number>;
  private instructionStack: number[]; // keep track of covering order. To reverse, unstack.
  private nodes: NodeTypes[];
  private colCount: number;
  private solutions: [];
  constructor() {
  }

  test = (stringToConvert: string): number => {
    return +stringToConvert;
  }

  private cover = () => {}

  private uncover = () => {}

  private hide = () => {}

  private unhide = () => {}

  private search = () => {}

  private getMinCol = (): number => {
    let min = -Infinity;
    this.activeColumns.forEach((activeOption) => {
      min = Math.min(min, this.nodes[activeOption].columnCount);
    });
    return min;
  }

  private reset = () => {
    this.colCount = 0;
    this.instructionStack = [];
    this.activeColumns = new Set();
    this.nodes = [];
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
  }

}

export default new DancingLinks;