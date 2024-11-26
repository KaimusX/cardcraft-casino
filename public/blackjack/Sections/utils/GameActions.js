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
        const cardForPlayer = deckManager.drawCard();
        const cardForDealer = deckManager.drawCard();
    
        // Update Player's Hand
        if (cardForPlayer) {
            playerScore += ["jack", "queen", "king"].includes(cardForPlayer.rank)
                ? 10
                : cardForPlayer.rank === "ace"
                    ? 11
                    : parseInt(cardForPlayer.rank);
    
            const playerCardImg = document.createElement("img");
            playerCardImg.src = `PlayingCards/${cardForPlayer.image}`;
            playerCardImg.classList.add("card");
            document.getElementById("deckContainer").appendChild(playerCardImg);
    
            const playerScoreElement = document.getElementById("playerScore");
            if (playerScoreElement) {
                playerScoreElement.textContent = playerScore;
            }
        }
    
        // Update Dealer's Hand
        if (cardForDealer) {
            // Dealer's hand container
            const dealerHandContainer = document.querySelector(".hand-box");
            if (!dealerHandContainer) {
                console.error("Dealer hand container (.hand-box) not found in the DOM.");
                return;
            }
    
            // Create the card image element
            const dealerCardImg = document.createElement("img");
            dealerCardImg.src = `PlayingCards/${cardForDealer.image}`; // Construct the path dynamically
            dealerCardImg.classList.add("card");
    
            // Append the card to the dealer's hand container
            dealerHandContainer.appendChild(dealerCardImg);
        }
    
        console.log(`Player Score: ${playerScore}, Dealer Score: ${dealerScore}`);
    }),    

    reset: new GameAction(() => {
        playerBalance += currentBet;

        document.getElementById("deckContainer").innerHTML = "";
        deckManager.initializeDeck();

        updateDisplay(playerBalance);
        showBetModal(playerBalance);
    }),
};
