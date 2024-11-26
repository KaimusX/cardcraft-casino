import { updateDisplay } from './DisplayUtils.js';
import { updateUserBalance } from './firebaseUtils.js';

let playerBalance = 0; // The player's current balance
let currentBet = 0;    // The current bet placed by the player

// Initialize betting with the player's starting balance
export function initializeBetting(balance) {
    if (typeof balance !== "number" || balance < 0) {
        console.error("Invalid initial balance:", balance);
        return;
    }

    playerBalance = balance;
    updateDisplay(playerBalance); // Update the UI with the initial balance
    console.log(`Betting initialized. Balance: $${playerBalance}`);
}

// Place a bet and update the balance
export function placeBet(amount, balance) {
    const bet = parseInt(amount);

    if (isNaN(bet) || bet <= 0) {
        alert("Please enter a valid bet amount.");
        return false;
    }

    if (bet > balance) {
        alert("Insufficient balance to place this bet.");
        return false;
    }

    currentBet = bet;
    balance -= bet; // Deduct from the provided balance

    // Update the UI
    updateDisplay(balance);
    console.log(`Bet placed: $${currentBet}. Remaining balance: $${balance}`);
    return balance; // Return the updated balance
}


// Refund the current bet (e.g., if the game is reset)
export function refundBet() {
    playerBalance += currentBet;
    currentBet = 0;

    // Update the UI
    updateDisplay(playerBalance);
    console.log(`Bet refunded. New balance: $${playerBalance}`);
}

// Get the current bet amount
export function getCurrentBet() {
    return currentBet;
}

// Get the player's current balance
export function getPlayerBalance() {
    return playerBalance;
}