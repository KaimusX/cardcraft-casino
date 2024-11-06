let currentBet = 0;
let playerBalance = 100;  // Example starting balance

function setupPlayerFunctions() {
    document.querySelector("button").addEventListener("click", setBet);
}

function setBet() {
    const betInput = document.getElementById("betInput");
    const betValue = parseInt(betInput.value) || 0;  // Get the bet value from the input field
    const balance = playerBalance;

    if (betValue > 0 && betValue <= balance) {
        currentBet = betValue;  // Update the bet
        playerBalance -= betValue;  // Deduct bet from player's balance
        document.getElementById("currentBet").textContent = `$${currentBet}`;  // Display the updated bet
        document.getElementById("playerBalance").textContent = `$${playerBalance}`;  // Update the balance
        console.log(`Bet placed: ${currentBet}`);

        // Hide the input and button after the bet is placed
        betInput.style.display = 'none';
        document.querySelector("button").style.display = 'none';
    } else if (betValue > balance) {
        alert("Insufficient balance. Please enter a smaller bet.");
    } else {
        alert("Please enter a valid bet.");
    }

    betInput.value = '';  // Clear the input after placing the bet (optional)
}

// Initialize player functions when the page is ready
setupPlayerFunctions();
