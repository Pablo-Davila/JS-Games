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

	function newCollection() {
		cardCollection = [];
		for (let i = 0; i < pairs; i++) {
			const random = Math.floor(Math.random() * 833);
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
		for (let i = 0; i < cardCollection.length; i++) {
			let card = $(
				`<div id="${i}" class="card"> 
  <div class="front">
    <img src="${urlCardBack}"></img>
  </div> 
  <div class="back">
    <img src="${cardCollection[i]}"></img>
  </div> 
</div>`);
			card.flip({
				trigger: 'manual'
			});
			htmlCards.push(card);
		}
		htmlCards.sort(() => 0.5 - Math.random());

		// Insert HTML cards
		for (let card of htmlCards) {
			card.click(flipcard);
			grid.append(card);
		}
	}

	function flipcard() {
		let cardId = $(this).attr("id");
		if (cardsWon.includes(cardId))
			return;
		cardsChosenId.push(cardId);
		$(this).flip(true);
		if (cardsChosenId.length === 2) {
			if (cardsChosenId[0] != cardsChosenId[1]) {
				setTimeout(checkForMatch, 500);
			}
			else cardsChosenId.pop();
		}
	}

	function checkForMatch() {
		const optionOneId = cardsChosenId[0];
		const optionTwoId = cardsChosenId[1];

		if (cardCollection[optionOneId] === cardCollection[optionTwoId]) {
			$(`#${optionOneId}`).css("box-shadow", "none");
			$(`#${optionTwoId}`).css("box-shadow", "none");
			$(`#${optionOneId} img`).attr("src", "img/white.png");
			$(`#${optionTwoId} img`).attr("src", "img/white.png");
			cardsWon.push(...cardsChosenId);
		}
		else {
			$(`#${optionOneId}`).flip(false);
			$(`#${optionTwoId}`).flip(false);
		}

		cardsChosenId = [];
	}

	function restart() {
		newCollection();
		createBoard();
	}

	$("#restart").click(restart);

	restart();
}

$(main);


