"use strict";

// Define grid size
const displayWidth = 4;
const displayHeight = 4;
const width = 10;
const height = 20;
let timerId = null;
let interval = 1000;

// Define smallTetrominoes
const smallTetrominoes = [
    [1, displayWidth+1, 2*displayWidth+1, 2],               // lTetromino
    [0, displayWidth, displayWidth+1, 2*displayWidth+1],    // zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2],      // tTetromino
    [0, 1, displayWidth, displayWidth+1],                   // oTetromino
    [1, displayWidth+1, 2*displayWidth+1, 3*displayWidth+1] // iTetromino
];

// Define tetrominos
const lTetromino = [
    [1, width+1, 2*width+1, 2],
    [width, width+1, width+2, 2*width+2],
    [1, width+1, 2*width+1, 2*width],
    [width, 2*width, 2*width+1, 2*width+2]
];

const zTetromino = [
    [0, width, width+1, 2*width+1],
    [width+1, width+2, 2*width, 2*width+1],
    [0, width, width+1, 2*width+1],
    [width+1, width+2, 2*width, 2*width+1]
];

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, 2*width+1],
    [width, width+1, width+2, 2*width+1],
    [1, width, width+1, 2*width+1]
];

const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
];

const iTetromino = [
    [1, width+1, 2*width+1, 3*width+1],
    [width, width+1, width+2, width+3],
    [1, width+1, 2*width+1, 3*width+1],
    [width, width+1, width+2, width+3]
];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];


function main() {

    const previewGrid = $(".preview-grid");
    const grid = $(".grid");
    const startBtn = $("#start-button");
    const scoreDisplay = $(".score-display");
    const linesDisplay = $(".lines-display");
    let currentPosition = 4;
    let score = 0;
    let lines = 0;

    function getRandom() {
	return Math.floor(Math.random()*theTetrominoes.length);
    }
    
    function createGrids() {
	previewGrid.empty();
	for(let i=0; i<displayWidth; i++) {
	    for(let j=0; j<displayHeight; j++) {
		previewGrid.append($(`<div></div>`));
	    }
	}
	
	grid.empty();
	for(let i=0; i<height; i++) {
	    for(let j=0; j<width; j++) {
		if(i != height-1) {
		    grid.append($(`<div></div>`));
		}
		else {
		    grid.append($(`<div></div>`,{"class": "block-bottom"}));
		}
	    }
	}
    }
    
    createGrids();

    const displaySquares = $(".preview-grid div").toArray();
    let squares = $(".grid div").toArray();
    
    //Randomly select a shape
    let random = getRandom();
    let nextRandom = getRandom();
    let currentRotation = 0;
    let current = theTetrominoes[random][currentRotation];
    
    // Draw the shape
    function draw() {
	current.forEach(
	    index => $(squares[currentPosition + index]).addClass("block-shape")
	);
    }
    
    draw();

    // Undraw the shape
    function undraw() {
	current.forEach(
	    index => $(squares[currentPosition + index]).removeClass("block-shape")
	);
    }

    // Move shape down
    function moveDown() {
	undraw();
	currentPosition = currentPosition += width;
	draw();
	checkFreeze();
    }

    // Move shape right
    function moveRight() {
	const isAtRightEdge = index => (currentPosition + index)%width === width-1;
	const collides = index =>  $(squares[currentPosition + index + 1]).hasClass("block-frozen");
	const bad = current.some(
	    index => isAtRightEdge(index) || collides(index)
	);
	if(!bad) {
	    undraw();
	    currentPosition += 1;
	    draw();
	}
    }

    // Move shape left
    function moveLeft() {
	const isAtLeftEdge = index => (currentPosition + index)%width === 0;
	const collides = index =>  $(squares[currentPosition + index - 1]).hasClass("block-frozen");
	const bad = current.some(
	    index => isAtLeftEdge(index) || collides(index)
	);
	if(!bad) {
	    undraw();
	    currentPosition -= 1;
	    draw();
	}
    }

    // Rotate shape
    // TODO: Avoid collisions
    function rotate() {
	undraw();
	currentRotation = (currentRotation+1)%current.length;
	current = theTetrominoes[random][currentRotation];
	draw();
    }

    // Show previous tetromino in displaySquares
    const displayIndex = 0;
    function displayShape() {
	displaySquares.forEach(
	    square => {
		$(square).removeClass("block-shape");
	    }
	);
	smallTetrominoes[nextRandom].forEach(
	    index => $(displaySquares[displayIndex + index]).addClass("block-shape")
	);
    }

    displayShape();

    // Freeze the shape if necessary
    function checkFreeze() {
	if( current.some(
	    index => $(squares[currentPosition + index + width]).hasClass("block-frozen")
		|| $(squares[currentPosition + index + width]).hasClass("block-bottom")
	)) {
	    current.forEach( index => {
		$(squares[currentPosition + index]).removeClass("block-shape");
		$(squares[currentPosition + index]).addClass("block-frozen");
	    });
	    random = nextRandom;
	    nextRandom = getRandom();
	    current = theTetrominoes[random][currentRotation];
	    currentPosition = 4;
	    draw();
	    displayShape();
	    gameOver();
	    addScore();
	}
    }

    // Game over
    function gameOver() {
	if(current.some(
	    index => squares[currentPosition + index].classList.contains("block-frozen"))
	  ){
	    scoreDisplay.text("END");
	    clearInterval(timerId);
	}
    }

    // Add score
    function addScore() {
	for(let i=0; i<199; i+=width){
	    const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
	    if(row.every(index => squares[index].classList.contains("block-frozen"))){
		score += 10;
		lines += 1;
		scoreDisplay.text(score);
		linesDisplay.text(lines);
		row.forEach(index => {
		    $(squares[index]).removeClass("block-frozen").removeClass("block-shape");
		});
		const squaresRemoved = squares.splice(i, width);
		squares = squaresRemoved.concat(squares);
		squares.forEach(cell => grid.append(cell));
	    }
	}
    }
    $("#music-button").click( function(){
	let music = document.getElementById("music");
	if (music.paused) music.play();
	else music.pause();
    });
    document.getElementById("music").volume = 0.2;

    // Assign functions to keycodes
    function control(e) {
	if(e.keyCode === 39) {
	    moveRight();
	}
	else if(e.keyCode === 38) {
	    rotate();
	}
	else if(e.keyCode === 37) {
	    moveLeft();
	}
	else if(e.keyCode === 40) {
	    moveDown();
	}
    }
    $(document).keyup(control);
    
    // Start button
    startBtn.click( function(){
	if(timerId) {
	    clearInterval(timerId);
	    timerId = null;
	}
	else {
	    draw();
	    timerId = setInterval(moveDown, 1000);
	    nextRandom = getRandom();
	    displayShape();
	}
    });
    
    draw();
}

$(main);
