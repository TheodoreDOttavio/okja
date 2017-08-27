/*
When Mija calls her friend Okja, she has a Parsimon for her.

Your Task.
Implement a variation of the A* pathfinding algorithm to find the shortest path from Okja's start to her goal (A Parsimon!)

Write a function that compares two maps, and returns an Array of [x,y] pairs that define Okja's path from start to goal
elevationMap is an array, where each value represents the vertical height, or z-axis.
terrainMap is an array the same size as elevationMap, except the values indicate the terrain type. Each value represents the time to traverse the terrain, except deep water (0).

0: Deep water
1: Dirt or flat rocky ground
2: Light underbrush and vegitation
3: Rocky river, Shallow water
4: Thick vegitation, Trees.
5: Big rocks

Movement from x=0, y=0 to x=1, y=0 takes one unit of time.
Movement from elevation 1 to 2 takes one unit of time.
Okja climb or jump 4 units, not 5 or more unless there is water
Okja will jump over a waterfall when Mija wants fish stew for dinner
  Ignore elevation when moving into terrain 0
Okja cannot jump out of deep water.
  Must have matching elevation to move out of terrain 0

Evaluate movement times to one decimal: 0.0
Diagnol and vertical changes are evaluated to one decimal place
  From [0,0], elevation=1, terrain=1
  to [1,1], elevation=1, terrain=1
  takes 1.5 units of time
    diagnol move is ((1^2)+(1^2))^0.5 = 1.4 + elevation (1-1) = 0 + terrain = 0.1.
*/

function MapObj(elevationmap, terrainmap){
  if (!(this instanceof MapObj)) { return new MapObj(elevationmap, terrainmap); }
  this.terrainmap = terrainmap;
  this.elevationmap = elevationmap;

  this.getMapCost = function(atNode) {
    //TODO need to avoid a jump down and later an equal climb up.
    // try removing negative elevation values. They negate distance and terrain.
    var x = atNode.x;
    var y = atNode.y;
    if (x < 0 || x > this.elevationmap[0].length-1){ return -1; }
    if (y < 0 || y > this.elevationmap.length-1){ return -1; }

    var fromx = atNode.parentNode.x;
    var fromy = atNode.parentNode.y;
    var elevationCost = this.elevationmap[y][x] - this.elevationmap[fromy][fromx];
    if (elevationCost < 0) {elevationCost *= -1};

    if (this.terrainmap[y][x] == 0){
      //this is deep water Jumping down into it is fine climbing out... not so much
      if (elevationCost < 0){ return -1; }
    }else if (elevationCost > 4){
      //everything outside of deep water, an elevation change of 4 or more is too steep.
      return -1;
    }

    return this.terrainmap[y][x] + elevationCost;
  }
};



function Node(x, y, parentNode, goalNode){
  if (!(this instanceof Node)) { return new Node(x, y, parentNode, goalNode); }
  this.x = x;
  this.y = y;

  this.parentNode = parentNode;
  this.goalNode = goalNode;

  if (parentNode != null) {
    this.eDistCost = parentNode.eDistCost;
  } else {
    this.eDistCost = 0;
  };

  if(goalNode != null) {
    var xd = x - this.goalNode.x;
    var yd = y - this.goalNode.y;
    this.goalCost = Math.sqrt((xd*xd) + (yd*yd));
  }else{
    this.goalCost = 0;
  };

  this.totalCost = function() {
    return this.goalCost + this.eDistCost;
  };

  this.matches = function(nodeobj) {
    if (nodeobj != null) {
      if (this.x == nodeobj.x && this.y == nodeobj.y) {
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  };

  this.compareCost = function(nodeobj) {
    return this.totalCost() - nodeobj.totalCost();
  };

  this.getSuccessors = function(map) {
    var successors = [];
    var cost = 0;
    var mapCost = 0;
    for (var xd = -1; xd <= 1; xd ++){
      for (var yd = -1; yd <= 1; yd ++){
        //add cost for moving 1 unit: Math.sqrt(1+1)
        if (xd == 0 || yd == 0) {
          cost = 1;
        } else {
          cost = 1.4;
        }

        successors.unshift(new Node(this.x + xd, this.y + yd, this, this.goalNode));
        successors[0].eDistCost += cost + this.eDistCost;
        mapCost = map.getMapCost(successors[0]);
        successors[0].eDistCost += mapCost;
        //remove if it is invalid
        if (mapCost == -1){
          successors.shift();
        }
        if (xd == 0 && yd == 0) {
          successors.shift();
        }
      };
    };
    return successors;
  }
}



function NodeList(){
  //used for Open and Closed lists
  //  holds Node objects in order of total cost
  if (!(this instanceof NodeList)) { return new NodeList(); }
  this.slist = [];

  this.indexOf = function(nodeobj){
    for (var i = 0; i < this.slist.length; i++) {
      if (this.slist[i].matches(nodeobj)) {
        return i
      }
    }
    return -1;
  };

  this.sortedPush = function(nodeobj){
    //sorted by totalCost
    if (this.slist.length == 0) {
      this.slist.push(nodeobj);
      return this.slist;
    }

    for (var i = 0; i < this.slist.length; i++) {
      if (this.slist[i].totalCost() >= nodeobj.totalCost()) {
        this.slist.splice(i, 0, nodeobj);
        return this.slist;
      }
    }
    this.slist.push(nodeobj);
  };

  this.printme = function() {
    console.log("Sorted List " + this.slist.length);
    for (var i = 0; i < this.slist.length; i++) {
      console.log("found " + this.slist[i].x + ":" + this.slist[i].y +
      " Cost from start " + this.slist[i].eDistCost +
      " total cost " + this.slist[i].totalCost());
    }
  };

};



function runOkja(elevationMap, terrainMap, startx, starty, parsimonx, parsimony){
  var map = new MapObj(elevationMap, terrainMap);
  var solutionPathList = [];
  var neighbors = [];
  var openFoundIndex = -1;
  var closeFoundIndex = -1;
  var path = [];

  var nodeGoal = new Node(parsimonx, parsimony, null, null);
  var nodeStart = new Node(startx, starty, null, nodeGoal);
  var openList = new NodeList();
  var closeList = new NodeList();
  openList.sortedPush(nodeStart);

  var nodeCurrent = new Node(nodeStart.x, nodeStart.y, nodeStart, nodeGoal);

  while (openList.slist.length > 0){
    nodeCurrent = openList.slist.shift();
    if (nodeCurrent.matches(nodeGoal)){
      nodeGoal.parentNode = nodeCurrent.parentNode;
      break;
    }

    neighbors = nodeCurrent.getSuccessors(map);
    for (var i = 0; i < neighbors.length; i++){
      //find node_successor on the OPEN list
      openFoundIndex = openList.indexOf(neighbors[i]);

      //if node_successor is on the OPEN or CLOSE list but the existing one is as good
      //or better then discard this successor and continue
      if (openFoundIndex >= 0){
        if (openList.slist[openFoundIndex].compareCost(nodeCurrent) <= 0){
          continue;
        }
      }

      closeFoundIndex = closeList.indexOf(neighbors[i]);
      if (closeFoundIndex >= 0){
        if (closeList.slist[closeFoundIndex].compareCost(nodeCurrent) <= 0){
          continue;
        }
      }

      //Remove occurences of node_successor from OPEN and CLOSED
      if (openFoundIndex != -1){
        openList.slist.splice(openFoundIndex,1);
      }
      if (closeFoundIndex != -1){
        closeList.slist.splice(closeFoundIndex,1);
      }

      openList.sortedPush(neighbors[i]);
    }
    closeList.sortedPush(nodeCurrent);
  }

  // openList.printme();
  var follow = nodeGoal;
  while(follow != null) {
    path.unshift([follow.x, follow.y]);
    follow = follow.parentNode;
  }
  // console.log(path);

  return path;
  // return {"path": path, "elevationMap": elevationMap, "terrainMap": terrainMap}
};
