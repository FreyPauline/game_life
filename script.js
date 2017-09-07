var pixelSize = 7;
    numCells = 130,
    canvas = document.getElementById('canvas');

canvas.width = pixelSize * numCells;
canvas.height = pixelSize * numCells;

var context = canvas.getContext('2d'),
    arr = buildArr(),
    draw = false,
    start = false;

function buildArr() {
    var arr = [];
    for(var i = 0; i < numCells; i++) {
        var innerArr = [];
        for(var j = 0; j < numCells; j++) {
            innerArr.push(0);
        }
    arr.push(innerArr);
    }
    return arr;
}

canvas.onmousedown = function (e) {
    cursX = (e.pageX - this.offsetLeft);
    cursY = (e.pageY - this.offsetTop);
    context.strokeStyle = "#00FF40";
    context.lineWidth = pixelSize;
    context.strokeRect(cursX, cursY, 1, 1);
    var cellX = Math.floor(cursX / pixelSize) > 160 ? 160 : Math.floor(cursX / pixelSize);
    var cellY =  Math.floor(cursY / pixelSize) > 160 ? 160 : Math.floor(cursY / pixelSize);
    arr[cellX][cellY] = 1;
    draw = true;
}

canvas.onmouseup = function () {
    draw = false;
};

canvas.onmousemove = function (e) {

    if (draw) {
        cursX = (e.pageX - this.offsetLeft);
        cursY = (e.pageY - this.offsetTop);
        var cellX = Math.floor(cursX / pixelSize) > 160 ? 160 : Math.floor(cursX / pixelSize);
        var cellY =  Math.floor(cursY / pixelSize) > 160 ? 160 : Math.floor(cursY / pixelSize);
        console.log("x " + cellX);
        console.log('y ' + cellY);
        arr[cellX][cellY] = 1;
    }
};

function display(arr) {
    for(var x = 0; x < arr.length; x++) {
        for(var y = 0; y < arr[x].length; y++) {
            drawCell(x, y, arr[x][y]);
        }
    }
}

function drawCell(x, y, alive) {
    context.beginPath();
    context.rect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    context.fillStyle = alive ? '#00FF40' : '#EEE';
    context.fill();
}

function randomlyPopulate(arr) {
    for(var x = 0; x < arr.length; x++) {
        for(y = 0; y < arr[x].length; y++) {
            if(Math.log(Math.random()*10) < -0.0) {
                arr[x][y]=1;
            }
        }
    }
}

function aliveNeighbors(arr, x, y) {
    if(x > 0 && y > 0 && x < numCells-1 && y < numCells-1) {
        var totalAlive =
        arr[x-1][y-1]+
        arr[x][y-1]+
        arr[x+1][y-1]+
        arr[x-1][y]+
        arr[x+1][y]+
        arr[x-1][y+1]+
        arr[x][y+1]+
        arr[x+1][y+1];
        return totalAlive;
    } else {
        return 0;
    }
}

function step(arr) {
    var newArr = buildArr();
    for(var x = 0; x < arr.length; x++) {
        for(var y = 0; y < arr[x].length; y++) {
            var cell = arr[x][y];
            var alives = aliveNeighbors(arr, x,y);
            if(cell == 1) {
                if(alives < 2) {
                    newArr[x][y] = 0;
                } else if(alives == 2 || alives == 3) {
                    newArr[x][y] = 1;
                } else if(alives > 3) {
                    newArr[x][y] = 0;
                }
                } else if(cell == 0 && alives == 3) {
                    newArr[x][y] = 1;
                }
        }
    }
    return newArr;
}


randomlyPopulate(arr);
display(arr);

setInterval(function() {
    var newArr = step(arr);
    display(newArr);
    arr = newArr;
}, 170)
