var cols = 25;
var rows = 25;
let grid = new Array(cols);     //array of columns to make a grid

let openSet = [];               //openSet keeps track of all the nodes that have not been visited
var closedSet = [];             //closedSet keeps track of all previously visited nodes
var start;            //starting point of the path
var end;              //end point of the path
var w, h;              //width (w) and height (h) of a cell in the grid
var path = [];
var noSolution = false;


function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
} //end of removeFromArray(arr,elt)

function heuristic(a, b) {
    var d = dist(a.i, a.j, b.i, b.j);
    //var d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
}

function Spot(i, j) {      //function to initialize values for a cell[i][j] on the grid
    this.i = i;         //i indicates row number
    this.j = j;         //j indicates column number
    this.f = Infinity;
    this.g = Infinity;
    this.h = 0;             //f = g + h, formula for A* algorithm
    this.neighbors = [];    //stores all neighboring cells of a cell
    this.previous = undefined;
    this.wall = false;

    if (random(1) < 0.3) {
        this.wall = true;
    }

    this.show = function (col) {    //show function to highlight the spot
        fill(col);
        if (this.wall) {
            fill(200);
        }
        //noStroke();
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
            this.neighbors.push(grid[i - 1][j - 1]);      //cell above and to the left
        }
        if (i < cols - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1]);      //cell above and to the right
        }
        if (i > 0 && j < rows - 1) {
            this.neighbors.push(grid[i - 1][j + 1]);      //cell below and to the left
        }
        if (i < cols - 1 && j < rows - 1) {
            this.neighbors.push(grid[i + 1][j + 1]);      //cell below and to the right
        }
    } //end of addNeighbors()
} //end of Spot()


function setup() {
    createCanvas(400, 400);
    console.log('A*');
    w = width / cols;     //width of a cell in the grid
    h = height / rows;    //height of a cell in the grid
    console.log(w);

    //loop to make an array of columns i.e a 2D array
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    //nested loop to run through and initialize all cells of the grid 
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }
  console.log(grid[1][1]);
    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
	start.wall = false;
	end.wall = false;
    openSet.push(start);
    openSet.push(grid[0][1]);
  

}

function draw() {
    background(80);
    console.log(openSet.length);
  console.log(openSet[0]);
    if (openSet.length > 0) {
        // keep going
        var winner = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }

        var current = openSet[winner];
        current.addNeighbors(grid);

        if (current === end) {
            noLoop();
            console.log("DONE!");
		var path = [];
        path.push(start);
        var temp = current;
        path.push(temp);
        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }
        
        for (var i = 0; i < path.length; i++) {
            path[i].show(color(0, 0, 255));
        }
           
		return;
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                var tempG = current.g + 1;
                var newPath = false;

                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }
                if (newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        }
	       
	
    }
    else {
        //no solution
        console.log('no solution');
        noLoop();
        return;
    }

    
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j].show(color(255));
        }
    }

    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(194, 239, 150));
    }

    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(239, 150, 236));
    }



   

}
