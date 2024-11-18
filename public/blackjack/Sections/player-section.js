let currentBet = 0;
let playerBalance = 100;  // Example starting balance

function setupPlayerFunctions() {
    document.querySelector("button").addEventListener("click", setBet);
}

function setBet() {
    const betInput = document.getElementById("betInput");
    const betButton = document.querySelector(".bet-button"); // Specifically target the Place Bet button
    const betValue = parseInt(betInput.value) || 0;  // Get the bet value from the input field
    const balance = playerBalance;

    if (betValue > 0 && betValue <= balance) {
        currentBet = betValue;  // Update the bet
        playerBalance -= betValue;  // Deduct bet from player's balance
        document.getElementById("currentBet").textContent = `$${currentBet}`;  // Display the updated bet
        document.getElementById("playerBalance").textContent = `$${playerBalance}`;  // Update the balance
        console.log(`Bet placed: ${currentBet}`);

        // Hide only the bet input and Place Bet button
        betInput.style.display = 'none';
        betButton.style.display = 'none';

        // Enable the Hit button after placing a bet
        document.getElementById("hit-button").disabled = false;

    } else if (betValue > balance) {
        alert("Insufficient balance. Please enter a smaller bet.");
    } else {
        alert("Please enter a valid bet.");
    }

    betInput.value = '';  // Clear the input after placing the bet (optional)
}


// Reset the player bet and balance to defaults
function resetPlayerState() {
    currentBet = 0;  // Reset the current bet
    playerBalance = 100;  // Reset the player's balance back to 100
    document.getElementById("currentBet").textContent = `$${currentBet}`;  // Update the displayed bet
    document.getElementById("playerBalance").textContent = `$${playerBalance}`;  // Update the displayed balance
}

// Initialize player functions when the page is ready
setupPlayerFunctions();
