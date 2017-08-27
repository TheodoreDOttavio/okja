# okja
This repository is a 'Kata' for codefights.com.
A kata is a code challenge and test cases.

This variation of the A* path finding algorithim is fun to see in 3d.
There's a preview.html to run the tests with a 3d preview.

## The code challenge:

When Mija calls her friend Okja, she has a Parsimon for her. Okja also loves to splash into deep water when Mija wants fish stew for dinner!

## Your Task.
Implement a pathfinding algorithm to find the shortest path from Okja's start to her goal (A Parsimon!)

Write a function that compares two maps, and returns an Array of [x,y] pairs that define Okja's path from start to goal
elevationMap is an array, where each value represents the vertical height, or z-axis.
terrainMap is an array the same size as elevationMap, except the values indicate the terrain type. Each value represents the time to traverse the terrain, except deep water (0).

* 0: Deep water
* 1: Dirt or flat rocky ground
* 2: Light underbrush and vegitation
* 3: Rocky river, Shallow water
* 4: Thick vegitation, Trees.
* 5: Big rocks

- Movement from x=0, y=0 to x=1, y=0 takes one unit of time.
- Movement from elevation 1 to 2 takes one unit of time.
- Okja climb or jump 4 units, not 5 or more unless there is water
- Okja will jump over a waterfall when Mija wants fish stew for dinner
--  Ignore elevation when moving into terrain 0
- Okja cannot jump out of deep water.
--  Must have matching elevation to move out of terrain 0

- Evaluate movement times to one decimal: 0.0
- Diagnol and vertical changes are evaluated to one decimal place
--  From [0,0], elevation=1, terrain=1
--  to [1,1], elevation=1, terrain=1
--  takes 1.5 units of time
--    diagnol move is ((1^2)+(1^2))^0.5 = 1.4 + elevation (1-1) = 0 + terrain = 0.1.
