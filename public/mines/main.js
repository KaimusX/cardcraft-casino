import {Mines, validateAndPlaceBet} from './mines.js';
import { getUserBalance, updateBalance, auth } from './mines.js';

let game;


async function startGame() {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to start the game.");
        return;
    }

    const size = parseInt(document.getElementById("boardSize").value);
    const mines = parseInt(document.getElementById("mineCount").value);
    const betAmount = parseInt(document.getElementById("betAmount").value);

    if (isNaN(size) || size <= 0 || size > 10) {
        alert("Board size must be a number between 1 and 10.");
        return;
    }

    const maxMines = size * size - 1;
    if (isNaN(mines) || mines <= 0 || mines >= maxMines) {
        alert(`Mine count must be a number between 1 and ${maxMines - 1}.`);
        return;
    }

    if (isNaN(betAmount) || betAmount <= 0) {
        alert("Please enter a valid bet amount.");
        return;
    }

    const betPlaced = await validateAndPlaceBet(user.uid, betAmount);
    if (!betPlaced) return;

    // Update balance after placing the bet
    await fetchAndDisplayUserBalance();

    const userBalanceDoc = await getUserBalance(user.uid);
    const initialBalance = Math.floor(userBalanceDoc.data().balance);

    game = new Mines(size, mines, betAmount);

    // Show game elements and hide settings
    document.getElementById("balance-reward-container").classList.remove("hidden");
    document.getElementById("cash-in-container").classList.remove("hidden");
    document.getElementById("settings-container").classList.add("hidden");
}

async function quitGame() {
    if (game) {
        const finalBalance = Math.round(game.balance);
        alert(`You quit the game. Your total winnings: $${finalBalance}`);

        const user = auth.currentUser;
        if (user) {
            // Update the user's balance after quitting
            const balanceDifference = finalBalance - game.initialBalance;
            await updateBalance(user.uid, balanceDifference);

            // Fetch and update the visible balance
            const userBalanceDoc = await getUserBalance(user.uid);
            const updatedBalance = Math.floor(userBalanceDoc.data().balance);
            updateUserBalance(updatedBalance);
        }

        // Reset the screen
        resetScreen();
    }
}

function updateUserBalance(balance) {
    const balanceDiv = document.getElementById("user-balance");
    balanceDiv.textContent = `Balance: $${balance.toFixed(2)}`;
}

async function fetchAndDisplayUserBalance() {
    const user = auth.currentUser;
    if (!user) {
        document.getElementById("user-balance").textContent = "Balance: Login Required";
        return;
    }

    const userBalanceDoc = await getUserBalance(user.uid);
    if (!userBalanceDoc) {
        document.getElementById("user-balance").textContent = "Balance: $0.00";
        return;
    }

    const balance = Math.floor(userBalanceDoc.data().balance);
    updateUserBalance(balance);
}

function resetScreen() {
    // Hide game elements
    document.getElementById("balance-reward-container").classList.add("hidden");
    document.getElementById("cash-in-container").classList.add("hidden");

    // Show settings container and re-center it
    const settingsContainer = document.getElementById("settings-container");
    settingsContainer.classList.remove("hidden");
    settingsContainer.classList.add("centered");

    // Clear the game area
    const gameDiv = document.getElementById("game");
    gameDiv.innerHTML = "";

    // Reset the game object
    game = null;

    // Reset the button text to "Cash In"
    const cashInButton = document.querySelector("#cash-in-container .btn");
    cashInButton.textContent = "Cash In";
}

window.startGame = startGame;
window.quitGame = quitGame;
window.addEventListener("load", async () => {
    await fetchAndDisplayUserBalance();
});

