import { placeBet } from './BettingUtils.js';
import { getCurrentUser, updateUserBalance, fetchOrCreateUserBalance } from './firebaseUtils.js';

export function showBetModal(playerBalance) {
    const betModal = document.getElementById('betModal');
    if (!betModal) {
        console.error("Bet modal not found in the DOM.");
        return;
    }

    const balanceDisplay = document.querySelector("#betModal .player-balance-display");
    if (balanceDisplay) balanceDisplay.textContent = `$${playerBalance}`;

    // Add event listener for the "place bet" button
    const placeBetButton = document.getElementById("placeBetButton");
    if (placeBetButton) {
        placeBetButton.removeEventListener("click", handlePlaceBet); // Ensure no duplicate listeners
        placeBetButton.addEventListener("click", handlePlaceBet);
    } else {
        console.error("Place Bet button not found in the DOM.");
    }

    betModal.classList.add('visible');
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
    console.log("handlePlaceBet called.");
    const betInput = document.getElementById("betInput");
    const betAmount = betInput ? betInput.value : null;

    const user = await getCurrentUser();
    if (!user) {
        console.error("No user signed in.");
        return;
    }

    const currentBalance = await fetchOrCreateUserBalance(user.uid);

    const updatedBalance = placeBet(betAmount, currentBalance);
    if (updatedBalance !== false) {
        await updateUserBalance(user.uid, currentBalance - updatedBalance, "subtract");
        console.log("Bet placed successfully. Closing modal.");
        hideBetModal(); // Close the modal if the bet was successfully placed
    }
}
