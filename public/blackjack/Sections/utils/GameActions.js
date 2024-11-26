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

    reset: new GameAction(() => {
        playerBalance += currentBet;
        currentBet = 0;
        playerScore = 0;

        document.getElementById("deckContainer").innerHTML = "";
        deckManager.initializeDeck();

        updateDisplay(playerBalance);

        console.log("Game reset. Balance refunded:", playerBalance);

        showBetModal(playerBalance);
    }),
};
