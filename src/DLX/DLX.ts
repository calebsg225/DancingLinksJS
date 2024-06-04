import MinHeap from "../utils/MinHeap";
import { NodeTypes } from "../type/NodeTypes";

class DancingLinks {
  private nodes: NodeTypes[];
  private itemCount: number;
  private currentSolution: number[];
  private solutions: Set<number>[];
  private optionCount: number;
  private minItemHeaderIndex: number;
  constructor() {
    this.reset();
  }

  // sets this.minItemHeaderIndex to the active item with the least amount of remaining options
  private setMinItemHeader = () => {
    let curNode = this.nodes[0].rightNode;
    this.minItemHeaderIndex = this.nodes[0].rightNode;
    while (curNode != 0) {
      if (this.nodes[curNode].columnCount < this.nodes[this.minItemHeaderIndex].columnCount) {
        this.minItemHeaderIndex = curNode;
      }
      curNode = this.nodes[curNode].rightNode;
    }
  }

  // clean slate for next computation
  private reset = () => {
    this.nodes = [];
    this.itemCount = 0;
    this.solutions = [];
    this.currentSolution = [];
  }

  // fill in required data for computation
  private setup = (nodes: NodeTypes[]) => {
    this.nodes = nodes;
    this.itemCount = this.nodes[0].leftNode;
    this.setOptionCount();
    this.currentSolution = new Array(this.optionCount + 1);
  }

  // set this.optionCount to the number of options available in the dataset
  private setOptionCount = () => {
    this.optionCount = 0;
    let i = this.nodes.length - 1;
    while(i != this.nodes[i].upNode) {
      this.optionCount++;
      i = this.nodes[i].upNode - 1;
    }
  }

  // covers an inputed item
  private coverItem = (headerItemToCover: number) => {
    const header = this.nodes[headerItemToCover];
    
    // hide all options from headers
    let p = header.downNode;
    while (p != headerItemToCover) {
      this.hide(p);
      p = this.nodes[p].downNode;
    }

    // hide header node from header row
    const l = header.leftNode;
    const r = header.rightNode;
    this.nodes[l].rightNode = r;
    this.nodes[r].leftNode = l;
  }

  // uncovers an inputed item
  private uncoverItem = (headerItemToUncover: number) => {
    const header = this.nodes[headerItemToUncover];

    // unhide header node from header row
    const l = header.leftNode;
    const r = header.rightNode;
    this.nodes[l].rightNode = headerItemToUncover;
    this.nodes[r].leftNode = headerItemToUncover;

    // unhide all options connected to header
    let p = header.upNode;
    while (p != headerItemToUncover) {
      this.unhide(p);
      p = this.nodes[p].upNode;
    }
  }

  // hides all nodes on the same option level as the inputed node from their respective items
  private hide = (nodeToHide: number) => {
    let node = nodeToHide + 1;
    while (nodeToHide !== node) {
      const header = this.nodes[node].headerNode;
      const upNode = this.nodes[node].upNode;
      const downNode = this.nodes[node].downNode;
      // cycle back around if the current node is a spacer
      if (this.nodes[node].nodeType === 'spacer') node = upNode;
      else {
        // hide selected node from its header
        this.nodes[upNode].downNode = downNode;
        this.nodes[downNode].upNode = upNode;

        this.nodes[header].columnCount--;
        node++;
      }
    }
  }

  // unhides all nodes of a given option level
  private unhide = (nodeToUnhide: number) => {
    let node = nodeToUnhide - 1;
    while (nodeToUnhide != node) {
      const header = this.nodes[node].headerNode;
      const upNode = this.nodes[node].upNode;
      const downNode = this.nodes[node].downNode;
      // cycle back around if the current node is a spacer
      if (this.nodes[node].nodeType === 'spacer') node = downNode;
      else {
        // unhide selected node from its header
        this.nodes[upNode].downNode = node;
        this.nodes[downNode].upNode = node;

        this.nodes[header].columnCount++;
        node--;
      }
    }
  }

  // find all possible solutions to exact cover problem
  // translated algorithm x sudo code from knuths paper to working javascript
  find = (nodes: NodeTypes[], solutionLimit: number = Infinity): Set<number>[] => {
    if (!nodes.length || solutionLimit <= 0) return [];
    // X1 START
    this.setup(nodes);
    let level = 0;
    //let solutionCount = 0;
    // X1 END

    while (true) {
      // X2
      if (this.nodes[0].rightNode === 0) {
        this.solutions.push(new Set(this.currentSolution.slice(0,level).map(v => this.nodes[v].option)));
        //solutionCount++;
        //if (!(solutionCount%100_000)) console.log(`${solutionCount}: [${this.currentSolution.slice(0,level).map(v => this.nodes[v].option)}]`);
        if (this.solutions.length >= solutionLimit) {
          const solutions = this.solutions;
          this.reset();
          //console.log(solutionCount);
          return solutions;
        };
        // X8 START
        if (level === 0) {
          const solutions = this.solutions;
          this.reset();
          //console.log(solutionCount);
          return solutions;
        }
        level--;
        this.uncoverItemsInOption(level);
        // X8 END
      } else {
        this.setMinItemHeader(); // X3
        // X4 START
        this.coverItem(this.minItemHeaderIndex);
        this.currentSolution[level] = this.nodes[this.minItemHeaderIndex].downNode;
        // X4 END
      }

      // X5
      while (this.currentSolution[level] === this.minItemHeaderIndex) {
        this.uncoverItem(this.minItemHeaderIndex); // X7
        // X8 START
        if (level === 0) {
          const solutions = this.solutions;
          this.reset();
          //console.log(solutionCount);
          return solutions;
        }
        level--;
        this.uncoverItemsInOption(level);
        // X8 END
      }

      // cover items other than i in option containing xl
      const xl = this.currentSolution[level];
      let p = xl + 1;
      while (p != xl) {
        if (this.nodes[p].nodeType === 'spacer') {p = this.nodes[p].upNode}
        else {
          this.coverItem(this.nodes[p].headerNode);
          p++;
        }
      }
      level++;
    }
  }

  // step in this.find
  // uncovers previously covered items of the current option, excluding the initial item
  private uncoverItemsInOption = (level: number) => {
    // X6
    const xl = this.currentSolution[level];
    let p = xl - 1;
    while (p != xl) {
      if (this.nodes[p].nodeType === 'spacer') {p = this.nodes[p].downNode}
      else {
        this.uncoverItem(this.nodes[p].headerNode);
        p--;
      }
    }
    this.minItemHeaderIndex = this.nodes[xl].headerNode;
    this.currentSolution[level] = this.nodes[xl].downNode;
  }

}

export default new DancingLinks;