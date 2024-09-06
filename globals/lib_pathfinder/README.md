# `lib_pathfinder`

Both A* and Dijkstra's algorithms are algorithms to find the shortest path between two nodes (a source and a target node) in a graph.

```text
A ---2--- B
|         |
1         3
|         |
C ---1--- D
```

## Dijkstra's Algorithm

*Works only if the graph has non negative and non zero edge weights.*

1. Add a `distance` property to all nodes (it represents the shortest distance from the source node to the goal node) and to reconstruct a path also add a `from` property to remember from which node the shortest distance originated
   - Set it to 0 for the source node (e.g. `A`)
   - Set it to infinity for all other nodes

    ```text
    [A=0] -----2--- (B=inf)
      |                |
      1                3
      |                |
    (C=inf) ---1--- (D=inf)

    VISITED=[]
    EXPLORE_MIN_PRIORITY_QUEUE=[(A|0)]
    ```

2. Add a `from` property to remember from which node the shortest distance originated
   - Set it to None for all nodes

    ```text
     [A={0|None}]  ---2--- (B={inf|None})
          |                     |
          1                     3
          |                     |
    (C={inf|None}) ---1--- (D={inf|None})

    VISITED=[]
    EXPLORE_MIN_PRIORITY_QUEUE=[(A|0)]
    ```

3. Use a minimum priority queue of graph nodes using their distance property (a list of graph nodes ordered from the shortest distance to the biggest).
Initially put the source `A` into it.
Now repeatedly take the first element of that list and explore it's neighboring nodes.
   1. Check if the distance from the current node + the weight of the edge to the neighboring node is smaller than the current distance value of the neighboring node
      - Distance to `B` through `A`: 0 + 2 = 2 (2 is smaller than infinity so update `B`)
      - Distance to `C` through `A`: 0 + 1 = 1 (1 is smaller than infinity so update `C`)
   2. Put each of the neighboring nodes into the minimum priority queue
   3. When finished mark the explored node as visited to not visit it again, **it already has the shortest distance to the source node**

    ```text
    Explore A:

    [A={0|None}] ---2---  (B={0+2|A})
          |                    |
          1                    3
          |                    |
    (C={0+1|A})  ---1--- (D={inf|None})

    VISITED=[A]
    EXPLORE_MIN_PRIORITY_QUEUE=[(C|1),(B|2)]

    Explore C:

    [A={0|None}] ---2---  (B={2|A})
          |                   |
          1                   3
          |                   |
     [C={1|A}]   ---1--- (D={1+1|C})

    VISITED=[A,C]
    EXPLORE_MIN_PRIORITY_QUEUE=[(B|2),(D|2)]

    Explore B:

    [A={0|None}] ---2---  [B={2|A}]
          |                   |
          1                   3
          |                   |
      [C={1|A}]  ---1--- (D={2|C}) -> 2+3>=2

    VISITED=[A,C,B]
    EXPLORE_MIN_PRIORITY_QUEUE=[(D|2)]

    Explore D:

    [A={0|None}] ---2--- [B={2|A}]
          |                  |
          1                  3
          |                  |
      [C={1|A}]  ---1--- [D={2|C}]

    VISITED=[A,C,B,D]
    EXPLORE_MIN_PRIORITY_QUEUE=[]
    ```

4. Using the two properties the shortest possible path can now be reconstructed between the source node `A` and any other node

## A* Algorithm

*Works only if the graph has non negative and non zero edge weights and the heuristic is admissable (the estimated distance of the heuristic is never shorter than the shortest distance between two nodes).*
