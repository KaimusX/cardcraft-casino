// GameActions.js using 
import DeckManager from '../utils/DeckManager.js';
import { showBetModal } from './ModalUtils.js';
import { updateDisplay } from './DisplayUtils.js';

export class GameAction {
    constructor(action) {
        this.action = action;
    }

    execute() {
        if (typeof this.action === "function") {
            this.action();
        } else {
            console.error("Invalid action provided.");
        }
    }
}

const deckManager = DeckManager.getInstance();
let playerScore = 0;
let playerBalance = 0;
let currentBet = 0;
let dealerScore = 0;

export const actions = {
    initialDeal: () => {
        const playerDeck = document.getElementById("deckContainer");
        const dealerDeck = document.querySelector(".hand-box");

        // Define scores as objects to pass by reference
        const playerScoreRef = { value: 0 };
        const dealerScoreRef = { value: 0 };

        // Deal 2 cards to the player and dealer
        dealCards(playerDeck, playerScoreRef, 2);
        dealCards(dealerDeck, dealerScoreRef, 2);

        // Update player and dealer scores
        playerScore = playerScoreRef.value;
        dealerScore = dealerScoreRef.value;

        const playerScoreElement = document.getElementById("playerScore");
        if (playerScoreElement) {
            playerScoreElement.textContent = playerScore;
        }

        const dealerScoreElement = document.getElementById("dealerScore");
        if (dealerScoreElement) {
            dealerScoreElement.textContent = dealerScore;
        }

        console.log(`Player Score: ${playerScore}, Dealer Score: ${dealerScore}`);
    },

    hit: new GameAction(() => {
        const card = deckManager.drawCard();
        if (card) {
            playerScore += ["jack", "queen", "king"].includes(card.rank)
                ? 10
                : card.rank === "ace"
                    ? 11
                    : parseInt(card.rank);

            const cardImg = document.createElement("img");
            cardImg.src = `PlayingCards/${card.image}`;
            cardImg.classList.add("card");
            document.getElementById("deckContainer").appendChild(cardImg);

            // Update the player's score in the DOM
            const playerScoreElement = document.getElementById("playerScore");
            if (playerScoreElement) {
                playerScoreElement.textContent = playerScore;
            }

            // Enable or disable the double button based on card count
            const playerDeck = document.getElementById("deckContainer");
            const doubleButton = document.getElementById("double-button");
            if (playerDeck && playerDeck.children.length === 2) {
                doubleButton.disabled = false; // Enable the double button
            } else {
                doubleButton.disabled = true; // Disable it otherwise
            }

            console.log(`Player Score: ${playerScore}`);
        }
    }),

    reset: new GameAction(() => {
        playerBalance += currentBet;

        document.getElementById("deckContainer").innerHTML = "";
        deckManager.initializeDeck();

        updateDisplay(playerBalance);
        showBetModal(playerBalance);
    }),
};

// Helper Functions
function dealCards(deckContainer, scoreVariable, numberOfCards) {
    for (let i = 0; i < numberOfCards; i++) {
        const card = deckManager.drawCard();
        if (card) {
            const cardImg = document.createElement("img");
            cardImg.src = `PlayingCards/${card.image}`;
            cardImg.classList.add("card");
            deckContainer.appendChild(cardImg);

            // Update the score variable
            scoreVariable.value += ["jack", "queen", "king"].includes(card.rank)
                ? 10
                : card.rank === "ace"
                    ? (scoreVariable.value + 11 > 21 ? 1 : 11)
                    : parseInt(card.rank);
        }
    }
}