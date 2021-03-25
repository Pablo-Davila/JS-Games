"use strict";

const pairs = 6;
const urlCardBack = "img/pokeball.png";

function getImageSrc(num) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${num}.png`;
}

function main() {
    
    const grid = $("#grid");

    let cardCollection = [];   // List of images URLs
    let cardsChosenId = [];    // List of selected cards
    let cardsWon = [];         // List of already found pairs

    function newCollection(){
	for(let i=0; i<pairs; i++) {
	    const random = Math.floor(Math.random()*833);
	    cardCollection.push(getImageSrc(random));
	    cardCollection.push(getImageSrc(random));
	}
    }    

    function createBoard() {

	// Reset data
	grid.empty();
	cardsChosenId = [];
	cardsWon = [];

	// Buind HTML collection
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

	// Insert HTML cards
	for(let i=0; i<htmlCards.length; i++) {
	    let card = htmlCards[i];
	    card.click(flipcard);
	    grid.append(card);
	}
    }

    function flipcard(){
	let cardId = $(this).attr("id");
	if (cardsWon.includes(cardId))
	    return;
	cardsChosenId.push(cardId);
	$(this).attr("src",cardCollection[cardId]);
	if (cardsChosenId.length === 2) {
	    if (cardsChosenId[0] != cardsChosenId[1]){
		setTimeout(checkForMatch, 500);
	    }
	    else cardsChosenId.pop();
	}
    }

    function checkForMatch() {
	const optionOneId = cardsChosenId[0];
	const optionTwoId = cardsChosenId[1];
	
	if (cardCollection[optionOneId] === cardCollection[optionTwoId]) {
	    $(`#${optionOneId}`).attr("src", "img/white.png");
	    $(`#${optionTwoId}`).attr("src", "img/white.png");
	    cardsWon.push(...cardsChosenId);
	}
	else {
	    $(`#${optionOneId}`).attr("src", urlCardBack);
	    $(`#${optionTwoId}`).attr("src", urlCardBack);
	}
	
	cardsChosenId = [];
    }

    newCollection();
    createBoard();
    $("#restart").click(createBoard);
}

$(main);


