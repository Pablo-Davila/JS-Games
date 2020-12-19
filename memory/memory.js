"use strict";

function main() {
    const cardArray = [
	{
	    name: "fries",
	    img: "img/fries.png"
	},
	{
	    name: "fries",
	    img: "img/fries.png"
	},
	{
	    name: "cheeseburger",
	    img: "img/cheeseburger.png"
	},
	{
	    name: "cheeseburger",
	    img: "img/cheeseburger.png"
	},
	{
	    name: "hotdog",
	    img: "img/hotdog.png"
	},
	{
	    name: "hotdog",
	    img: "img/hotdog.png"
	},
	{
	    name: "ice-cream",
	    img: "img/ice-cream.png"
	},
	{
	    name: "ice-cream",
	    img: "img/ice-cream.png"
	},
	{
	    name: "milkshake",
	    img: "img/milkshake.png"
	},
	{
	    name: "milkshake",
	    img: "img/milkshake.png"
	},
	{
	    name: "pizza",
	    img: "img/pizza.png"
	},
	{
	    name: "pizza",
	    img: "img/pizza.png"
	},
    ];

    cardArray.sort(() => 0.5-Math.random());
    
    const grid = $(".grid");
    const resultDisplay = $("#result");
    
    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];

    function checkForMatch() {
	let cards = $("img");
	const optionOneId = cardsChosenId[0];
	const optionTwoId = cardsChosenId[1];
	if (cardsChosen[0] === cardsChosen[1]) {
	    alert("You found a match!");
	    $(cards[optionOneId]).attr("src", "img/white.png");
	    $(cards[optionTwoId]).attr("src", "img/white.png");
	    cardsWon.push(cardsChosen);
	}
	else {
	    $(cards[optionOneId]).attr("src", "img/blank.png");
	    $(cards[optionTwoId]).attr("src", "img/blank.png");
	    alert("Sorry, try again");
	}
	cardsChosen = [];
	cardsChosenId = [];
	resultDisplay.text(cardsWon.length);
	if (cardsWon.length === cardArray.length/2) {
	    resultDisplay.text("Congratulations! You found them all!");
	}
    }

    function flipcard(){
	let cardId = $(this).attr("data-id");
	cardsChosen.push(cardArray[cardId].name);
	cardsChosenId.push(cardId);
	$(this).attr("src",cardArray[cardId].img);
	if (cardsChosen.length === 2) {
	    setTimeout(checkForMatch, 500);
	}
    }

    function createBoard() {
	for(let i=0; i<cardArray.length; i++) {
	    var card =  $(
		"<img></img>",
		{
		    "src": "img/blank.png",
		    "data-id": i
		}
	    );
	    card.click(flipcard);
	    grid.append(card);
	}
    }
    
    createBoard();
}

$(main);


