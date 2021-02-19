"use strict";

// Define grid size
const previewWidth = 4;
const previewHeight = 4;
const width = 10;
const height = 20;
let timerId = null;
let interval = 1000;
let playing = false;
let gameIsOver = false;

// Define smallTetrominoes
const smallTetrominoes = [
    [1, previewWidth+1, 2*previewWidth+1, 2],               // lTetromino
    [0, previewWidth, previewWidth+1, 2*previewWidth+1],    // zTetromino
    [1, previewWidth, previewWidth+1, previewWidth+2],      // tTetromino
    [0, 1, previewWidth, previewWidth+1],                   // oTetromino
    [1, previewWidth+1, 2*previewWidth+1, 3*previewWidth+1] // iTetromino
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
    const startBtn = $("#btn-play");
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
	for(let i=0; i<previewWidth; i++) {
	    for(let j=0; j<previewHeight; j++) {
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

    const previewSquares = $(".preview-grid div").toArray();
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
	checkFreeze();
    }
    
    // Undraw the shape
    function undraw() {
	current.forEach(
	    index => $(squares[currentPosition + index]).removeClass("block-shape")
	);
    }

    // Move shape down
    function moveDown() {
	if(!playing) return;
	undraw();
	currentPosition = currentPosition += width;
	draw();
    }
    
    // Move shape to the bottom
    function moveFullDown() {
	if(!playing) return;
	undraw();
	let mini = height;
	for(let index of current){
	    let counter = 0;
	    let nextSquare = $(squares[currentPosition+index + (counter+1)*width]);
	    while(!nextSquare.hasClass("block-frozen") && !nextSquare.hasClass("block-bottom")){
		counter++;
		nextSquare = $(squares[currentPosition+index + (counter+1)*width]);
	    }
	    if(counter < mini) mini = counter;
	}
	for(let i=0; i<mini; i++){
	    moveDown();
	}
    }

    // Move shape right
    function moveRight() {
	if(!playing) return;
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
	if(!playing) return;
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
	if(!playing) return;
	undraw();
	currentRotation = (currentRotation+1)%current.length;
	current = theTetrominoes[random][currentRotation];
	draw();
    }

    // Show previous tetromino in previewSquares
    const displayIndex = 0;
    function drawPreview() {
	previewSquares.forEach(
	    square => {
		$(square).removeClass("block-shape");
	    }
	);
	smallTetrominoes[nextRandom].forEach(
	    index => $(previewSquares[displayIndex + index]).addClass("block-shape")
	);
    }

    drawPreview();

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
	    gameOver();
	    addScore();
	    if(!gameIsOver){
		random = nextRandom;
		nextRandom = getRandom();
		current = theTetrominoes[random][currentRotation];
		currentPosition = 4;
		draw();
		drawPreview();
	    }
	}
    }

    // Game over
    function gameOver() {
	for(let i=width; i<2*width; i++){
	    if($(squares[i]).hasClass("block-frozen")){
		gameIsOver = true;
		scoreDisplay.text("END");
		clearInterval(timerId);
	    }
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

    // Music button
    function musicOn() {
	$("#btn-music").attr("src", "../img/nosound.png");
	music.play();
	music.loop = true;
    }
    function musicOff() {
	$("#btn-music").attr("src", "../img/sound.png");
	music.pause();
    }
    function musicToggle(){
	let music = document.getElementById("music");
	if (music.paused) musicOn();
	else musicOff();
    }
    
    $("#btn-music").click(function(event){
	musicToggle();
	$("#game").focus();
    });
    document.getElementById("music").volume = 0.2;

    // Start button
    function playToggle(){
	let music = document.getElementById("music");
	$("#game").focus();

	if(timerId) {
	    playing = false;
	    startBtn.attr("src", "../img/play.png");
	    clearInterval(timerId);
	    timerId = null;
	    musicOff();
	}
	else {
	    playing = true;
	    startBtn.attr("src", "../img/pause.png");
	    draw();
	    timerId = setInterval(moveDown, 1000);
	    nextRandom = getRandom();
	    drawPreview();
	    gameIsOver = false;

	    if (music.paused){
		musicOn();
	    }
	}
    }
    startBtn.click(playToggle);

    // Assign functions to keycodes
    function control(e) {
	if(e.keyCode === 39) {
	    moveRight();
	}
	else if(e.keyCode === 37) {
	    moveLeft();
	}
	else if(e.keyCode === 40) {
	    moveDown();
	}
	else if(e.keyCode === 38) {
	    rotate();
	}
	else if(e.key === " "){
	    moveFullDown();
	}
	else if(e.key === "p") {
	    playToggle();
	}
	else if(e.key === "m") {
	    musicToggle();
	}
    }
    $(document).keyup(control);
    
    draw();
}

$(main);
