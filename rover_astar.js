var cols = 25;
var rows = 25;
let grid = new Array(cols);     //array of columns to make a grid

let openSet = [];               //openSet keeps track of all the candidate nodes
var closedSet = [];             //closedSet keeps track of all nodes to be included in the path

var start;            //starting point of the path
var end;              //end point of the path
var w, h;             //width (w) and height (h) of a cell in the grid
var path = [];	      //path stores the final path found by the algorithm	


function removeFromArray(arr, elt) {	//function to remove an element from an array
    	for (var i = arr.length - 1; i >= 0; i--) 
		{
        	if (arr[i] == elt) 
            		arr.splice(i, 1);
  		}
} //end of removeFromArray(arr,elt)


function heuristic(a, b) {
    var d = dist(a.i, a.j, b.i, b.j);	//Euclidean Distance Heuristic
    return d;
}


function Spot(i, j) {      //function to initialize values for a spot[i][j] on the grid
    this.i = i;         	//i indicates row number
    this.j = j;         	//j indicates column number
    this.f = Infinity;
    this.g = Infinity;
    this.h = 0;             	//f = g + h, formula for A* algorithm
    this.neighbors = [];    	//array to store all neighboring cells of spot[i][j]
    this.previous = undefined;	//previous stores the spot which comes just before the given spot in the path
    this.wall = false;		//determines if the cell is a wall, i.e an obstacle

    if (random(1) < 0.3) {	//sets up obstacles in the grid
        this.wall = true;
    }

    this.show = function (col) {    //show function to highlight the spot
        fill(col);
        if (this.wall) {
            fill(100);		//colors obstacles grayscale 100
        }
        
        rect(this.i * w, this.j * h, w - 1, h - 1);
    }

    this.addNeighbors = function (grid) {     //function to add all eight neighboring cells to neighbors[]
        var i = this.i;
        var j = this.j;

        if (i < cols - 1) {
            this.neighbors.push(grid[i + 1][j]);        //cell to the right
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);        //cell to the left
        }
        if (j < rows - 1) {
            this.neighbors.push(grid[i][j + 1]);        //cell below
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);        //cell above
        }
        if (i > 0 && j > 0) {
            this.neighbors.push(grid[i - 1][j - 1]);    //cell above and to the left
        }
        if (i < cols - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1]);    //cell above and to the right
        }
        if (i > 0 && j < rows - 1) {
            this.neighbors.push(grid[i - 1][j + 1]);    //cell below and to the left
        }
        if (i < cols - 1 && j < rows - 1) {
            this.neighbors.push(grid[i + 1][j + 1]);    //cell below and to the right
        }
    } //end of addNeighbors()
} //end of Spot()


function setup() {
    createCanvas(400, 400);	//p5 inbuilt function
    //console.log('A*');
    w = width / cols;     //width of a cell in the grid
    h = height / rows;    //height of a cell in the grid
    //console.log(w);

    //loop to make an array of columns i.e a 2D array
    for (var i = 0; i < cols; i++) 
    	{
        grid[i] = new Array(rows);
    	}

    //nested loop to run through and initialize all cells of the grid 
    for (var i = 0; i < cols; i++) 
    	{
        for (var j = 0; j < rows; j++) 
		{
            	grid[i][j] = new Spot(i, j);
        	}
  	}
  
    //console.log(grid[1][1]);
    start = grid[0][0];			//start is the top left spot in the grid
    end = grid[cols - 1][rows - 1];	//end is the bottom right spot
    start.wall = false;			//start and end cannot be obstacles themselves
    end.wall = false;
	
    openSet.push(start);		//add start to openSet
    //openSet.push(grid[0][1]);
	
}	//end of setup()


function draw() {
    background(80);			//canvas background
    //console.log(openSet.length);
    //console.log(openSet[0]);
	
    if (openSet.length > 0) 
    	{
        //if openSet is not empty, find the spot in openSet with the lowest f value
        var select = 0;
        for (var i = 0; i < openSet.length; i++) 
		{
            	if (openSet[i].f < openSet[select].f) 
			{
                	select = i;
            		}
       		}

        var current = openSet[select];	//set value of current equal to the selected node
        current.addNeighbors(grid);	//get all neighbors of current spot

        if (current === end) 
		{//if current equals end, the end node has been reached
          	noLoop();	//noLoop stops the p5 draw() function from continuing to execute
            	console.log("DONE!");
			
		var path = [];		//records the final path
        	path.push(start);	//manually push start spot to path since previous of start is undefined
        	
		var temp = current;	//work backwards from current === end 
        	path.push(temp);
        	while (temp.previous) 
			{
            		path.push(temp.previous);	//trace path all the way till start spot
            		temp = temp.previous;
        		}
        
        	for (var i = 0; i < path.length; i++) 
			{
           		path[i].show(color(0, 0, 255));		//shows final path in RGB(0,0,255) i.e blue
       	 		}
           
		return;		
       		}
	
	//if current is not equal to end, continue 
        removeFromArray(openSet, current);	//remove current from openSet
        closedSet.push(current);		//add current to closedSet

        var neighbors = current.neighbors;	//obtain neighbors of current
	
	//loop through all neighbors		
        for (var i = 0; i < neighbors.length; i++) 
		{
            	var neighbor = neighbors[i];

		if (!closedSet.includes(neighbor) && !neighbor.wall) 
			{
                	var tempG = current.g + 1;
                	var newPath = false;

                	if (openSet.includes(neighbor))
				{
                    		if (tempG < neighbor.g) 
					{
                        		neighbor.g = tempG;
                        		newPath = true;
                    			}
                		} 
			else 
				{
                    		neighbor.g = tempG;
                    		newPath = true;
                    		openSet.push(neighbor);
                		}
				
                	if (newPath) 
				{
                    		neighbor.h = heuristic(neighbor, end);
                    		neighbor.f = neighbor.g + neighbor.h;
                    		neighbor.previous = current;
				}
                	}
        	}
	}
    	
	else 	//if openSet is empty, no path is possible
		{
        	console.log('no solution');
        	noLoop();
        	return;
    		}
	
	//nested loop to show the grid in white
    	for (var i = 0; i < rows; i++) 
		{
        	for (var j = 0; j < cols; j++) 
			{
            		grid[i][j].show(color(255));
        		}
    		}

    	for (var i = 0; i < closedSet.length; i++) 
		{
        	closedSet[i].show(color(200, 240, 150));	//show all closedSet spots in RGB color(200,240,150)
    		}

    	for (var i = 0; i < openSet.length; i++) 
		{
        	openSet[i].show(color(240, 150, 240));		//show all openSet spots in RGB color(240,150,240)
    		}

}	//end of draw()
