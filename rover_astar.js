var cols = 20;
var rows = 20;
var grid = new Array(cols);     //array of columns to make a grid

function make_grid() {    
  createCanvas(400,400);
  console.log('A*');
  
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
  
  console.log(grid);
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
  this.w = width/cols;
  this.h = height/rows;
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
  
  this.wall = false;

  if(random(1) < 0.3){
    this.wall = true;
  }
  
  this.show = function(col){    //show function to highlight the spot
    fill(col);
    
    if(this.wall){
      fill(0);
    }
    noStroke();
    rect(this.i*w, this.j*h,w-1,h-1);
  }
  
} //end of node_values()  

function start_end(){
  start = grid[0][0];                 //marking starting point at [0][0]
  start.wall = false;
  end = grid[rows - 1][cols - 1];     //marking end point at [rows-1][cols-1]
  end.wall = false;
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
         console.log('Path found');
         final_path(previous, neighbor);
         break;
      }
    
      if(!neighbor.wall){
          var tempG = current.g + 1;            //tempG = current.g + weight of edge between current and neighbor, assumed to be 1
          if(tempG < neighbor.g){               //if tempG < neighbor.g, it means a better path has been found 
              neighbor.g = tempG;
              neighbor.f = neighbor.g + heuristic(neighbor,end);
              previous[neighbor] = current;
        
              if (!openSet.includes(neighbor)) openSet.push(neighbor);    //bring neighbor to openSet if a better path through it is found
          }
      } //end of if statement
    
    }  //end of for loop of neighbors
   if(!openSet.length) console.log("Path not possible");
 }   //end of while loop
  
  
} //end of function A_star

function grid_ui(){
  background(0);
  for(var i = 0; i < cols; i++ ){
    for(var j = 0; j < rows; j++ ){
      grid[i][j].show(color(255));
    }
  }

  for(var i=0;i < closedSet.length; i++){
    closedSet[i].show(color(255,0,0));
  }

  for(var i=0;i < openSet.length; i++){
    openSet[i].show(color(0,255,0));
  }

  for(var i=0; i < total_path.length; i++){
      total_path[i].show(color(0,0,255));
  }

    noFill();
    stroke(255);
    beginShape();
    for(var i=0; i < path.length; i++){
      vertex(path[i].i*w + w/2, path[i].j*h + h/2);
    }
} //end of grid_ui function
  
  
