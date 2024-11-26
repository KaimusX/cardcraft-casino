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

export const actions = {
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

            console.log(`Player Score: ${playerScore}`);
        }
    }),

    hit: new GameAction(() => {
        const card = deckManager.drawCard();
        if (card) {
            // Update playerScore based on the card's rank
            playerScore += ["jack", "queen", "king"].includes(card.rank)
                ? 10
                : card.rank === "ace"
                    ? 11
                    : parseInt(card.rank);
    
            // Add the card image to the player's deck container
            const cardImg = document.createElement("img");
            cardImg.src = `PlayingCards/${card.image}`;
            cardImg.classList.add("card");
            document.getElementById("deckContainer").appendChild(cardImg);
    
            // Update the player's score display in the UI
            const playerScoreElement = document.getElementById("playerScore");
            if (playerScoreElement) {
                playerScoreElement.textContent = playerScore;
            } else {
                console.error("Player score element not found in the DOM.");
            }
    
            console.log(`Player Score: ${playerScore}`);
        }
    }),
    
};
