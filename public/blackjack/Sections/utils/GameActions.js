// GameActions.js using 
import DeckManager from '../utils/DeckManager.js';
import PlayerState from './PlayerState.js';
import { setBalance } from './BettingUtils.js';

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
        console.log("Player hits.");
        const playerDeck = document.getElementById("deckContainer");
        const playerScoreRef = { value: PlayerState.getPlayerScore() }; // Pass current score by reference

        // Deal one card to the player
        dealCards(playerDeck, playerScoreRef, 1);
        PlayerState.setPlayerScore(playerScoreRef.value); // Update the player's score

        // Update the player's score display
        const playerScoreElement = document.getElementById("playerScore");
        if (playerScoreElement) {
            playerScoreElement.textContent = PlayerState.getPlayerScore();
        }

        // Check if player busts
        if (PlayerState.getPlayerScore() > 21) {
            alert(`Bust! You lose. Score: ${PlayerState.getPlayerScore()}`);
            actions.reset.execute();
        }
    }),

    double: new GameAction(() => {
        console.log("Double action triggered.");

        // Ensure the player has enough balance to double the bet
        if (currentBet * 2 > playerBalance + currentBet) {
            alert("Insufficient balance to double the bet.");
            return;
        }

        // Double the bet and deduct the additional amount from the balance
        const newBet = currentBet * 2; // Double the bet
        const newBalance = playerBalance - currentBet; // Deduct the additional amount

        console.log("Updating balance and bet for double:", { newBalance, newBet });

        setBalance(newBalance, newBet); // Update balance and current bet

        // Deal one card to the player
        const playerDeck = document.getElementById("deckContainer");
        const playerScoreRef = { value: playerScore }; // Pass current score by reference
        dealCards(playerDeck, playerScoreRef, 1); // Deal exactly one card
        playerScore = playerScoreRef.value;

        // Update the player's score display
        const playerScoreElement = document.getElementById("playerScore");
        if (playerScoreElement) {
            playerScoreElement.textContent = playerScore;
        }

        // Check if player busts
        if (playerScore > 21) {
            alert(`Bust! You lose. Score: ${playerScore}`);
            actions.reset.execute();
            return;
        }

        // End player's turn and trigger dealer's turn
        actions.stand.execute();
    }),

    stand: new GameAction(() => {
        console.log("Player stands. Dealer's turn begins.");

        // Disable all player actions since their turn is over
        document.getElementById("hit-button").disabled = true;
        document.getElementById("double-button").disabled = true;
        document.getElementById("stand-button").disabled = true;

        // Dealer's turn logic
        dealerTurn();
    }),

    double: new GameAction(() => {
        console.log("Double action triggered.");
    
        const currentBet = PlayerState.getBet();
        const playerBalance = PlayerState.getBalance();
    
        // Ensure the player has enough balance to double the bet
        if (currentBet * 2 > playerBalance) {
            alert("Insufficient balance to double the bet.");
            return;
        }
    
        // Deduct the total doubled bet and update the current bet
        const newBalance = playerBalance - currentBet; // Deduct only the additional bet
        PlayerState.setBalance(newBalance); // Update the player's balance
        PlayerState.setBet(currentBet * 2); // Update the player's bet
    
        // Log deduction
        console.log(`Player doubled the bet. New balance: $${PlayerState.getBalance()}, Current Bet: $${PlayerState.getBet()}`);
    
        // Deal one card to the player
        const playerDeck = document.getElementById("deckContainer");
        const playerScoreRef = { value: PlayerState.getPlayerScore() }; // Pass current score by reference
        dealCards(playerDeck, playerScoreRef, 1);
        PlayerState.setPlayerScore(playerScoreRef.value); // Update the player's score
    
        // Check if the player busts
        if (PlayerState.getPlayerScore() > 21) {
            alert(`Bust! You lose. Score: ${PlayerState.getPlayerScore()}`);
            actions.reset.execute();
            return;
        }
    
        // End turn
        actions.stand.execute();
    }),
    
    

    reset: new GameAction(async () => {
        console.log("Resetting the game...");

        // Deduct the bet and reset the player's state
        await PlayerState.reset();

        // Clear UI
        const playerDeck = document.getElementById("deckContainer");
        const dealerDeck = document.querySelector(".hand-box");

        if (playerDeck) playerDeck.innerHTML = ""; // Clear player cards
        if (dealerDeck) dealerDeck.innerHTML = ""; // Clear dealer cards

        const playerScoreElement = document.getElementById("playerScore");
        const dealerScoreElement = document.getElementById("dealerScore");

        if (playerScoreElement) playerScoreElement.textContent = 0;
        if (dealerScoreElement) dealerScoreElement.textContent = 0;

        console.log("Game reset. Ready for new round.");

        // Refresh the page to reset all UI and show the betting modal
        location.reload();
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

function dealerTurn() {
    console.log("Dealer's turn...");

    const dealerDeck = document.querySelector(".hand-box");
    const dealerScoreElement = document.getElementById("dealerScore");
    const dealerScoreRef = { value: dealerScore };

    // Dealer hits until their score is 17 or higher
    while (dealerScoreRef.value < 17) {
        dealCards(dealerDeck, dealerScoreRef, 1); // Dealer draws one card
        dealerScore = dealerScoreRef.value; // Update the dealer's score

        // Update dealer score display
        if (dealerScoreElement) {
            dealerScoreElement.textContent = dealerScore;
        }

        console.log(`Dealer's score: ${dealerScore}`);
    }

    // Check for dealer bust
    if (dealerScore > 21) {
        alert("Dealer busts! You win!");
        actions.reset.execute(); // Reset the game
        return;
    }

    // Determine the winner
    determineWinner();
}

function determineWinner() {
    console.log("Determining the winner...");

    if (playerScore > dealerScore) {
        alert(`You win! Your score: ${playerScore}, Dealer's score: ${dealerScore}`);
    } else if (playerScore < dealerScore) {
        alert(`You lose! Your score: ${playerScore}, Dealer's score: ${dealerScore}`);
    } else {
        alert(`It's a tie! Your score: ${playerScore}, Dealer's score: ${dealerScore}`);
    }
    // Reset the game for a new round
    actions.reset.execute();
}

function updateDoubleButtonState() {
    const doubleButton = document.getElementById("double-button");
    const playerDeck = document.getElementById("deckContainer");

    if (doubleButton && playerDeck && playerDeck.children.length === 2 && currentBet * 2 <= playerBalance) {
        doubleButton.disabled = false; // Enable the double button
    } else {
        doubleButton.disabled = true; // Disable it otherwise
    }
}

