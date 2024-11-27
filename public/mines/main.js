import { Mines } from './mines.js';
import { getUserBalance, updateBalance, auth } from './mines.js';

let game;

async function startGame() {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to start the game.");
        return;
    }

    const userBalanceDoc = await getUserBalance(user.uid);
    if (!userBalanceDoc) {
        alert("Error: User balance not found.");
        return;
    }

    const initialBalance = Math.floor(userBalanceDoc.data().balance); // Convert to integer

    // Populate the balance input field and start the game

    let size = parseInt(document.getElementById("boardSize").value);
    let mines = parseInt(document.getElementById("mineCount").value);
    game = new Mines(size, mines, initialBalance);
}

async function quitGame() {
    if (game) {
        game.board.revealAll();

        const finalBalance = Math.round(game.balance); // Ensure integer
        const initialBalance = Math.round(game.initialBalance); // Ensure integer

        if (isNaN(finalBalance) || isNaN(initialBalance)) {
            alert("Error: Invalid balance. Cannot cash out.");
            return;
        }

        const user = auth.currentUser;
        if (user) {
            const balanceDifference = finalBalance - initialBalance;

            // Update the user's Firestore balance only if the calculation is valid
            await updateBalance(user.uid, balanceDifference);
        }

        alert(`You quit the game. Your total winnings: $${finalBalance}`);
    }
}

window.startGame = startGame;
window.quitGame = quitGame;

