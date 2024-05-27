import MinHeap from "../utils/MinHeap";
import { HeaderNode, NodeTypes } from "../type/NodeTypes";

class DancingLinks {
  private activeItems: Set<number>;
  private nodes: NodeTypes[];
  private itemCount: number;
  private currentSolution: number[];
  private solutions: number[][];
  private lastSpacer: number;
  private optionCount: number;
  private minItemHeaderIndex: number;
  constructor() {
  }

  test = (stringToConvert: string): number => {
    return +stringToConvert;
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
    this.activeItems.delete(headerItemToCover);
  }

  // uncovers an inputed item
  private uncoverItem = (headerItemToUncover: number) => {
    const header = this.nodes[headerItemToUncover];

    // unhide header node from header row
    const l = header.leftNode;
    const r = header.rightNode;
    this.nodes[l].rightNode = headerItemToUncover;
    this.nodes[r].leftNode = headerItemToUncover;
    this.activeItems.add(headerItemToUncover);

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

  private setMinItemHeader = () => {
    this.minItemHeaderIndex = 1;
    this.activeItems.forEach((activeItem) => {
      if (this.nodes[activeItem].columnCount < this.nodes[this.minItemHeaderIndex].columnCount) {
        this.minItemHeaderIndex = activeItem;
      }
    });
  }

  private reset = () => {
    this.itemCount = 0;
    this.activeItems = new Set();
    this.nodes = [];
    this.currentSolution = [];
    this.solutions = [];
  }

  private setup = (nodes: NodeTypes[]) => {
    this.nodes = nodes;
    this.itemCount = this.nodes[0].leftNode;
    this.activeItems = new Set(Array.from(Array(this.itemCount), (_, i) => i + 1));
    this.lastSpacer = nodes.length - 1;
    this.currentSolution = [];
    this.solutions = [];
    this.setOptionCount();
  }

  private setOptionCount = () => {
    this.optionCount = 1;
    let i = this.itemCount + 1;
    while (i < this.lastSpacer) {
      i = this.nodes[i].downNode + 1;
      this.optionCount++;
    }
  }

  /*
        SIMPLIFIED ALGORITHM X SUDO CODE FROM SUDO CODE IN KNUTHS PAPER
  X1: initialize
    n = num items
    z = last spacer address

  X2: level l
    if no more active items, ( add to the solution, if l=0 return solutions, else lower l, goto X6 )

    select an uncovered item (possibly one with the lowest number of available options)

    cover(i)
    xl = downlink of node i;

  X5: try xl
    if xl = i (meaning no other options), uncover(i), if l=0 return solutions, else lower l, goto X6
    cover items other than i in option containing xl then increase a level and go to X2

  X6: try again
    uncover items other than i in option containing xl, goto X5;
  */


  // find all possible solutions to exact cover problem
  // translated algorithm x sudo code to working javascript
  findAll = (nodes: NodeTypes[]) => {
    this.setup(nodes);
    let level = 0;

    while (true) {
      // X2 in sudo code
      if (!this.activeItems.size) {
        this.solutions.push(this.currentSolution);
        if (level === 0) {
          return this.solutions;
        } else {
          level--;
          this.currentSolution.pop();
          this.uncoverItemsInOption(level);
        }
      } else {
        this.setMinItemHeader();
        this.coverItem(this.minItemHeaderIndex);
        this.currentSolution.push(this.nodes[this.minItemHeaderIndex].downNode);
      }

      // X5 in sudo code
      while (this.currentSolution[level] === this.minItemHeaderIndex) {
        this.uncoverItem(this.minItemHeaderIndex);
        if (level === 0) {
          return this.solutions;
        } else {
          level--;
          this.currentSolution.pop();
          this.uncoverItemsInOption(level);
        }
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

  // X6 in sudo code
  private uncoverItemsInOption = (level: number) => {
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