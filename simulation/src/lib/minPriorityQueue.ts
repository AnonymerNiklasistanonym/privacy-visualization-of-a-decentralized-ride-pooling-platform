/**
 * A heap is a type of binary tree that satisfies a specific property:
 * every node is either greater than or equal to (max-heap) or less than or equal to (min-heap) its children.
 *
 * This means that the root node of a heap always contains the maximum (max-heap) or minimum (min-heap) value of the entire tree.
 * A heap is usually implemented as an array, where the parent-child relationship is determined by the index of each element.
 * For example, if the root node is at index 0, then its left child is at index 1 and its right child is at index 2.
 * A heap can be used to efficiently perform operations such as finding the kth largest or smallest element, sorting, or merging sorted lists.
 */
export class MinHeap<ELEMENT_TYPE> {
  private items: Array<[ELEMENT_TYPE, number]>;

  constructor() {
    this.items = [];
  }

  push(element: ELEMENT_TYPE, value: number) {
    this.items.push([element, value]);
    this.bubbleUp();
  }

  pop(): ELEMENT_TYPE {
    if (this.size() === 0) {
      throw Error('MinHeap is empty!');
    }
    const min = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0 && last) {
      this.items[0] = last;
      this.bubbleDown();
    }
    return min[0];
  }

  size(): number {
    return this.items.length;
  }

  removeAll(callback: (element: Readonly<ELEMENT_TYPE>) => boolean): void {
    this.items = this.items.filter(item => !callback(item[0]));
    // Rebuild the heap after removal
    this.buildHeap();
  }

  private buildHeap(): void {
    for (let i = Math.floor(this.items.length / 2) - 1; i >= 0; i--) {
      this.bubbleDown(i);
    }
  }

  private bubbleUp(index: number = this.items.length - 1): void {
    const [element, val] = this.items[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.items[parentIndex];
      if (val >= val) break;
      this.items[index] = parent;
      index = parentIndex;
    }
    this.items[index] = [element, val];
  }

  private bubbleDown(index: number = 0): void {
    const length = this.items.length;
    const element = this.items[index];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let leftChild = null;
      let rightChild = null;
      let swap = null;

      if (leftChildIndex < length) {
        leftChild = this.items[leftChildIndex];
        if (leftChild[1] < element[1]) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.items[rightChildIndex];
        if (
          (swap === null && rightChild[1] < element[1]) ||
          (swap !== null && rightChild[1] < leftChild![1])
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.items[index] = this.items[swap];
      index = swap;
    }

    this.items[index] = element;
  }
}

/**
 * A heap-based priority queue leverages a heap data structure to efficiently manage the priority of elements. The core idea is to maintain a partial order among the elements such that the highest (or lowest) priority element can be accessed in constant time and other operations like insertion and deletion are efficient (typically logarithmic time). Here are the key concepts and benefits of using a heap for a priority queue:
Key Concepts

    Heap Properties:
        Binary Heap: The most common type of heap used in priority queues. It is a complete binary tree, meaning all levels are fully filled except possibly the last level, which is filled from left to right.
        Min-Heap: In a min-heap, the key at each node is less than or equal to the keys of its children. The smallest element is at the root.
        Max-Heap: In a max-heap, the key at each node is greater than or equal to the keys of its children. The largest element is at the root.

    Priority Queue Operations:
        Insertion (enqueue): Add a new element to the heap and reheapify to maintain the heap property. This involves placing the new element at the end of the heap and "bubbling up" to restore the heap order.
        Removal (dequeue): Remove the root element (highest priority for max-heap or lowest priority for min-heap) and reheapify. This involves replacing the root with the last element and "bubbling down" to restore the heap order.
        Peek: Access the root element without removing it, providing the highest or lowest priority element in constant time.

Benefits

    Efficiency:
        Time Complexity: Operations like insertion and deletion are O(log n) due to the tree structure's height, while peeking at the highest or lowest priority element is O(1).
        Space Complexity: Heaps use space proportional to the number of elements, O(n).

    Dynamic Priority Management:
        Heaps dynamically adjust to changes in the data set, ensuring that the priority queue always maintains its properties efficiently.

    Simplicity and Versatility:
        Heaps are relatively simple to implement and can be used for a variety of applications, such as scheduling tasks, managing resources, and implementing algorithms like Dijkstra's and A*.
 */
export class MinPriorityQueue<T> {
  private items: MinHeap<T>;

  constructor() {
    this.items = new MinHeap<T>();
  }

  enqueue(element: Readonly<T>, priority: number): void {
    this.items.push(element, priority);
  }

  dequeue(): T {
    if (this.isEmpty()) {
      throw Error('MinPriorityQueue is empty!');
    }
    return this.items.pop();
  }

  removeAll(callback: (element: Readonly<T>) => boolean): void {
    this.items.removeAll(callback);
  }

  isEmpty(): boolean {
    return this.items.size() === 0;
  }

  size(): number {
    return this.items.size();
  }
}
