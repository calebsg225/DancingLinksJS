import MinHeap from "../utils/MinHeap";
import { HeaderNode, NodeTypes } from "../type/NodeTypes";

class DancingLinks {
  private activeItems: Set<number>;
  private nodes: NodeTypes[];
  private itemCount: number;
  private currentSolution: number[];
  private solutions: number[][];
  private lastSpacer: number;
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

  private getMinCol = (): number => {
    let minOptionCountIndex = 1;
    this.activeItems.forEach((activeItem) => {
      if (this.nodes[activeItem].columnCount < this.nodes[minOptionCountIndex].columnCount) {
        minOptionCountIndex = activeItem;
      }
    });
    return minOptionCountIndex;
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
  }

  /*
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
  findAll = (nodes: NodeTypes[]) => {
    this.setup(nodes);
    let level = 0;

    while (true) {
      // X2
      if (!this.activeItems.size) {
        this.solutions.push(this.currentSolution);
        if (level === 0) {
          return this.solutions;
        } else {
          level--;
          this.uncoverItemsInOption()
        }
      } else {
        // select uncovered item
        // cover selected item
        // xl = downlink of node i
      }
      // X5
      while ('xl = i') {
        // uncover(i)
        if (level === 0) {
          return this.solutions;
        } else {
          level--;
          this.uncoverItemsInOption()
        }
      }

      // cover items other than i in option containing xl
      level++;
    }
  }

  // X6
  private uncoverItemsInOption = () => {}

}

export default new DancingLinks;