// simple minheap implementation, may or may not use

class MinHeap {
  private heap: number[];
  constructor(nums: number[]) {
    this.heap = [];
    this.buildHeap(nums);
  }
  private buildHeap = (nums: number[]): void => {
    for (const num of nums) {
      this.insert(num);
    }
  }
  extractMin = (): number => {
    this.swap(0, this.heap.length - 1);
    const res = this.heap.pop();
    this.shiftDown(0);
    return res;
  }
  insert = (num: number): void => {
    this.heap.push(num);
    this.shiftUp(this.heap.length - 1);
  }
  private shiftUp = (i: number): void => {
    if (!i) return;
    const p = Math.floor((i-1)/2);
    if (this.heap[i] < this.heap[p]) {
      this.swap(i, p);
      this.shiftUp(p);
    }
  }
  private shiftDown = (i: number): void => {
    const l = 2*i + 1;
    if (l >= this.heap.length) return;
    const r = 2*i + 2;

    let s = i;
    if (this.heap[l] < this.heap[s]) s = l;
    if (r < this.heap.length && this.heap[r] < this.heap[s]) s = r;

    if (s !== i) {
      this.swap(s, i);
      this.shiftDown(s);
    }
  }
  private swap = (i: number, j: number): void => {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

export default MinHeap;