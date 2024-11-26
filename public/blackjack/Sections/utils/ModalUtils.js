import { placeBet, getPlayerBalance, getCurrentBet } from './BettingUtils.js';
import { getCurrentUser, updateUserBalance, fetchOrCreateUserBalance } from './firebaseUtils.js';

export function showBetModal() {
    const betModal = document.getElementById('betModal');
    if (!betModal) {
        console.error("Bet modal not found in the DOM.");
        return;
    }

    // Get current balance and bet
    const balance = getPlayerBalance();
    const currentBet = getCurrentBet();

    // Update the modal display
    const balanceDisplay = document.querySelector("#betModal .player-balance-display");
    const betDisplay = document.querySelector("#betModal .current-bet-display");

    if (balanceDisplay) {
        balanceDisplay.textContent = `$${balance}`;
    }

    if (betDisplay) {
        betDisplay.textContent = `$${currentBet}`;
    }

    // Show the modal
    betModal.classList.add('visible');
    console.log(`Bet modal displayed. Balance: $${balance}, Current Bet: $${currentBet}`);
}

export function hideBetModal() {
    const betModal = document.getElementById('betModal');
    if (!betModal) {
        console.error("Bet modal not found in the DOM.");
        return;
    }

    betModal.classList.remove('visible');
}

export async function handlePlaceBet() {
    const betInput = document.getElementById("betInput");
    const betAmount = betInput ? betInput.value : null;

    const user = await getCurrentUser();
    const currentBalance = await fetchOrCreateUserBalance(user.uid);

    const updatedBalance = placeBet(betAmount, currentBalance);
    if (updatedBalance !== false) {
        await updateUserBalance(user.uid, currentBalance - updatedBalance, "subtract");
        console.log("Bet placed successfully. Closing modal.");
        hideBetModal(); // Close the modal if the bet was successfully placed
    } 
}
