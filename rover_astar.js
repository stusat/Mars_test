var cols = 20;
var rows = 20;
var grid = new Array(cols);     //array of columns to make a grid

var openSet = [];               //openSet keeps track of all the nodes that have not been visited
var closedSet = [];             //closedSet keeps track of all previously visited nodes
var start;            //starting point of the path
var end;              //end point of the path
var w,h;              //width (w) and height (h) of a cell in the grid

function final_path(prev, node){
  var total_path = [];
  total_path.prepend(current);
  while (prev.includes(current)){
        current = prev[current];
        total_path.prepend(current);
  }
  return total_path;
}  

function remove_elem(arr, node) {
  for(var i= arr.length - 1; i>=0; i--){
    if (arr[i] == node) {
      arr.splice(i,1);
    }
  }
} //end of remove_elem(arr,node)

function heuristic(a,b) {
  var d = dist(a.i, a.j, b.i, b.j);
  return d;
}

function node_val(i,j) {      //function to initialize values for a cell[i][j] on the grid
  this.i = i;         //i indicates row number
  this.j = j;         //j indicates column number
  this.f = Infinity;
  this.g = Infinity;
  this.h = 0;             //f = g + h, formula for A* algorithm
  this.neighbors = [];    //stores all neighboring cells of a cell
  this.previous = undefined;
  this.wall = false;

  if(random(1) < 0.3){
    this.wall = true;
  }

  this.show = function(col){    //show function to highlight the spot
    fill(col);
    if(this.wall){
      fill(200);
    }
    //noStroke();
    rect(this.i*w, this.j*h,this.i*(w-1),this.j*(h-1));
  }
  
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
} //end of node_val()


function setup() {
  createCanvas(400, 400);
  console.log('Pathfinder - A*');
  w = width / cols;     //width of a cell in the grid
  h = height / rows;    //height of a cell in the grid
  console.log(w);

  //loop to make an array of columns i.e a 2D array
  for(var i = 0; i < cols; i++){
    grid[i] = new Array(rows);
  }

  //nested loop to run through and initialize all cells of the grid 
  for(var k = 0; k < cols; k++){
    for(var j = 0; j < rows; j++){
      grid[i][j] = node_val(i,j);
    }
  }
  start = grid[0][0];
  end = grid[cols-1][rows-1];
  openSet.push(start);

}

function draw() {
  background(80);
  console.log(openSet.length);
  
  if(openSet.length){
 
    var chosen = 0;
    for(var i=0; i< openSet.length; i++){
      if(openSet[i].f < openSet[chosen].f){
        chosen = i;
      }
    }

    var current = openSet[chosen];
   
    if(current == end){
      noLoop();
      console.log("Path found");
    }

    remove_elem(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for(var l=0; l<neighbors.length; l++){
      var neighbor = neighbors[i];

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
  }
  else{
    console.log('no solution');
    noLoop();
    return;
  }

  for(var m = 0; m < cols; m++ ){
    for(var n = 0; n < cols; n++ ){
      grid[m][n].show(color(255));
    }
  }

  for(var p=0;p < closedSet.length; p++){
    closedSet[p].show(color(255,0,0));
  }

  for(var a=0;a < openSet.length; a++){
    openSet[a].show(color(0,255,0));
  }

   for(var b=0; b < total_path.length; b++){
      total_path[b].show(color(0,0,255));
    }

    noFill();
    stroke(255);
    beginShape();
    for(var c=0; c < path.length; c++){
      vertex(path[c].i*w + w/2, path[c].j*h + h/2);
    }

}

