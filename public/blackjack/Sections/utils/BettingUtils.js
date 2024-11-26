import { updateDisplay, updateCurrentBet } from './DisplayUtils.js';
import { actions } from './GameActions.js';
import PlayerState from './PlayerState.js';

// Set balance and bet
export function setBalance(newBalance, newBet = 0) {
    PlayerState.setBalance(newBalance); // Update balance in PlayerState
    PlayerState.setBet(newBet); // Update bet in PlayerState

    // Update the UI
    updateDisplay(PlayerState.getBalance());
    updateCurrentBet(PlayerState.getBet());

    console.log(`Balance updated to: $${PlayerState.getBalance()}, Current Bet: $${PlayerState.getBet()}`);
}

// Place a bet and update the balance
export function placeBet(amount) {
    const bet = parseInt(amount);

    if (isNaN(bet) || bet <= 0) {
        alert("Please enter a valid bet amount.");
        return false;
    }

    if (bet > PlayerState.getBalance()) {
        alert("Insufficient balance to place this bet.");
        return false;
    }

    // Deduct the bet from the balance and set the current bet
    setBalance(PlayerState.getBalance() - bet, bet);

    actions.initialDeal(); // Start the game with the initial deal
    return PlayerState.getBalance(); // Return the updated balance
}

// Refund the current bet (e.g., if the game is reset)
export function refundBet() {
    setBalance(PlayerState.getBalance() + PlayerState.getBet(), 0); // Refund the bet and reset it

    console.log(`Bet refunded. Balance: $${PlayerState.getBalance()}, Current Bet: $${PlayerState.getBet()}`);
}

// Get the current bet amount
export function getCurrentBet() {
    return PlayerState.getBet();
}

// Get the player's current balance
export function getPlayerBalance() {
    return PlayerState.getBalance();
}
