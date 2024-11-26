import { updateDisplay, updateCurrentBet } from './DisplayUtils.js';
import { actions } from './GameActions.js';
import { updateUserBalance } from './firebaseUtils.js';

let playerBalance = 0; // The player's current balance
let currentBet = 0;    // The current bet placed by the player


// Initialize betting with the player's starting balance
export function setBalance(newBalance, newBet = 0) {
    console.log("setBalance called with:", { newBalance, newBet });

    if (typeof newBalance !== "number" || newBalance < 0) {
        console.error("Invalid balance:", newBalance);
        return;
    }

    if (typeof newBet !== "number" || newBet < 0) {
        console.error("Invalid bet:", newBet);
        return;
    }

    playerBalance = newBalance;
    currentBet = newBet;

    // Update the UI
    updateDisplay(playerBalance); // Update balance display
    updateCurrentBet(currentBet); // Update current bet display

    console.log(`Balance set. Balance: $${playerBalance}, Current Bet: $${currentBet}`);
}

// Place a bet and update the balance
export function placeBet(amount) {
    const bet = parseInt(amount);

    if (isNaN(bet) || bet <= 0) {
        alert("Please enter a valid bet amount.");
        return false;
    }

    if (bet > playerBalance) {
        alert("Insufficient balance to place this bet.");
        return false;
    }

    // Deduct the bet from the balance and set the current bet
    setBalance(playerBalance - bet, bet);

    actions.initialDeal(); // Start the game with the initial deal
    return playerBalance; // Return the updated balance
}


// Refund the current bet (e.g., if the game is reset)
export function refundBet() {
    setBalance(playerBalance + currentBet, 0); // Refund the current bet and reset it

    console.log(`Bet refunded. New balance: $${playerBalance}, Current Bet: $${currentBet}`);
}


// Get the current bet amount
export function getCurrentBet() {
    return currentBet;
}

// Get the player's current balance
export function getPlayerBalance() {
    return playerBalance;
}