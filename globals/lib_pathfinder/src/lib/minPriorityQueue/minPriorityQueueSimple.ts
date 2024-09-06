export class MinPriorityQueueSimple<T> {
  private heap: {item: T; priority: number}[];

  constructor() {
    this.heap = [];
  }

  enqueue(item: T, priority: number): void {
    this.heap.push({item, priority});
    this.heap.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.heap.shift()?.item;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}
