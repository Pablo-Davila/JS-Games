"use strict";

const pairs = 6;
const urlCardBack = "img/pokeball.png";

function getImageSrc(num) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${num}.png`;
}

function main() {

    //cardArray.sort(() => 0.5-Math.random());
    
    const grid = $(".grid");
    const resultDisplay = $("#result");

    let cardCollection = [];
    let cardsChosenId = [];
    let cardsChosenIndex = [];
    let cardsWon = [];

    function newCollection(){
	for(let i=0; i<pairs; i++) {
	    const random = Math.floor(Math.random()*833);
	    cardCollection.push(getImageSrc(random));
	    cardCollection.push(getImageSrc(random));
	}
    }    

    function createBoard() {
	let htmlCards = [];
	let i = 0;
	for(let i=0; i<cardCollection.length; i++) {
	    let card =  $(
		"<img></img>",
		{
		    "id": i,
		    "src": urlCardBack,
		    "class": "card"
		}
	    );
	    htmlCards.push(card);
	}
	htmlCards.sort(() => 0.5 - Math.random());
	
	for(let i=0; i<htmlCards.length; i++) {
	    let card = htmlCards[i];
	    card.click(flipcard);
	    grid.append(card);
	}
    }

    function flipcard(){
	/**/console.log("Flip");
	let cardId = $(this).attr("id");
	cardsChosenId.push(cardId);
	$(this).attr("src",cardCollection[cardId]);
	
	if (cardsChosenId.length === 2) {
	    setTimeout(checkForMatch, 500);
	}
    }

    function checkForMatch() {
	const optionOneId = cardsChosenId[0];
	const optionTwoId = cardsChosenId[1];
	
	if (cardCollection[optionOneId] === cardCollection[optionTwoId]) {
	    $(`#${optionOneId}`).attr("src", "img/white.png");
	    $(`#${optionTwoId}`).attr("src", "img/white.png");
	    cardsWon.push(cardsChosenId);
	}
	else {
	    $(`#${optionOneId}`).attr("src", urlCardBack);
	    $(`#${optionTwoId}`).attr("src", urlCardBack);
	}
	cardsChosenId = [];
	cardsChosenIndex = [];
	resultDisplay.text(cardsWon.length);
	if (cardsWon.length === pairs) {
	    resultDisplay.text("Congratulations! You found them all!");
	}
    }

    newCollection();
    createBoard();
}

$(main);


