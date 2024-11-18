import { Mines } from './mines.js';

let game;

function startGame() {
    let size = parseInt(document.getElementById("boardSize").value);
    let mines = parseInt(document.getElementById("mineCount").value);
    let initialBalance = parseFloat(document.getElementById("initialBalance").value);
    game = new Mines(size, mines, initialBalance);
}

function quitGame() {
    if (game) {
        game.board.revealAll();
        alert(`You quit the game. Your total winnings: $${game.balance.toFixed(2)}`);
    }
}

window.startGame = startGame;
window.quitGame = quitGame;


