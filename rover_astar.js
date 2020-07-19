var cols = 20;
var rows = 20;
var grid = new Array(cols);     //array of columns to make a grid

function make_grid() {    

  //loop to make an array of columns i.e a 2D array
  for(var i = 0; i < cols; i++){
    grid[i] = new Array(rows);
  }

  //nested loop to run through and initialize all cells of the grid 
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j] = node_values(i,j);
    }
  }
}

function final_path(prev, node){
  var total_path = [];
  total_path.prepend(current);
  while (prev.includes(current)){
        current = prev[current];
        total_path.prepend(current);
  }
  return total_path;
}  

function remove(arr, node) {
  for(var i= arr.length - 1; i>=0; i--){
    if (arr[i] == node) {
      arr.splice(i,1);
    }
  }
}

function heuristic(a,b) {
  var d = dist(a.i, a.j, b.i, b.j);
  return d;
}

function node_values(i,j){
  this.i = i;             
  this.j = j;
  this.g = Infinity;
  this.f = Infinity;
  this.h = 0;             //f = g + h, formula for A* algorithm
  this.neighbors = [];    //stores all neighboring cells of a cell
  this.previous = undefined;
  
  this.addNeighbors = function(grid){     //function to add all eight neighboring cells to neighbors[]
    var i = this.i;
    var j = this.j;

    if(i< cols -1){
      this.neighbors.push(grid[i+1][j]);        //cell to the right
    }
    if(i>0){
      this.neighbors.push(grid[i-1][j]);        //cell to the left
    }
    if(j< rows-1){
      this.neighbors.push(grid[i][j+1]);        //cell below
    }
    if(j>0){
      this.neighbors.push(grid[i][j-1]);        //cell above
    }
    if(i>0 && j>0){
      this.neighbors.push(grid[i-1][j-1]);      //cell above and to the left
    }
    if(i<cols-1 && j>0){
      this.neighbors.push(grid[i+1][j-1]);      //cell above and to the right
    }
    if(i>0 && j< rows-1){
      this.neighbors.push(grid[i-1][j+1]);      //cell below and to the left
    }
    if(i<cols-1 && j< rows-1){
      this.neighbors.push(grid[i+1][j+1]);      //cell below and to the right
    }
  } //end of addNeighbors()
} //end of node_values()  

function start_end(){
  start = grid[0][0];                 //marking starting point at [0][0]
  end = grid[rows - 1][cols - 1];     //marking end point at [rows-1][cols-1]
}  

function A_star(start, end){

var openSet = [];          //openSet keeps track of all the nodes that have not been visited
var closedSet = [];        //closedSet keeps track of all visited nodes
var previous = [];         //previous keeps track of the previous node in the path for each node

start.g = 0;
start.h = heuristic(start, end);
start.f = start.g + start.h;
openSet.push(start);

while(openSet.length){
  var chosen = 0;
  for(var i = 0; i < openSet.length; i++){
    if (openSet[i].f < openSet[chosen].f)
      chosen = i;                             //the node with the lowest f value in openSet becomes the next 'chosen' node for the path
  }

  var current = chosen;
  if(current == end) {
    final_path(previous, current);
    break;
  }

  remove(openSet, current);
  closedSet.push(current);                   //remove current node from openSet and add it to closedSet
  
  var neighbors = current.neighbors;
  for(var i = 0; i < neighbors.length; i++){
      var neighbor = neighbors[i];
      
      if(neighbor == end) {
         final_path(previous, neighbor);
         break;
      }
      
      var tempG = current.g + 1;            //tempG = current.g + weight of edge between current and neighbor, assumed to be 1
      if(tempG < neighbor.g){
          neighbor.g = tempG;
          neighbor.f = neighbor.g + heuristic(neighbor,end);
          previous[neighbor] = current;
      }
    
      if (!openSet.includes(neighbor)) openSet.push(neighbor);
   }
 }
} 
