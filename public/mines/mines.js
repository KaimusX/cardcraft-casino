import { Board } from './board.js';

class Mines {
    constructor(size, mines, initialBalance) {
        this.board = new Board(size, mines);
        this.balance = initialBalance;
        this.minesHit = false;
        this.updateBalance();
        this.renderBoard();
    }

    revealCell(row, col) {
        if (this.board.revealCell(row, col)) {
            if (this.board.isMine(row, col)) {
                this.balance = 0;
                alert("You hit a mine! Game over.");
                this.minesHit = true;
                this.board.revealAll();
                this.renderBoard()
                return true;
            }

            if (this.board.isDiamond(row, col)) {
                this.updateBalance(true);
                this.renderBoard();
                this.updateReward();
                return true;
            }

            this.updateBalance();
            this.renderBoard();
            this.updateReward();
            return true;
        }
    }

    winMultiplier() {
        let revealedCells = this.board.revealed.flat().filter(cell => cell).length;
        let mineRatio = this.board.mines / (this.board.size * this.board.size);
        if (mineRatio <= 0.1) {
            return 1 + (revealedCells / (this.board.size * this.board.size)) * 4;
        } else if (mineRatio <= 0.2) {
            return 1 + (revealedCells / (this.board.size * this.board.size)) * 7;
        } else {
            return 1 + (revealedCells / (this.board.size * this.board.size)) * 9;
        }
    }

    updateBalance(diamondHit = false) {
        if(diamondHit)  this.balance *= this.winMultiplier() * 3;
        else this.balance *= this.winMultiplier();
        let balanceDiv = document.getElementById("balance");
        balanceDiv.innerHTML = `Current Balance: $${this.balance.toFixed(2)}`;
        this.updateReward();
    }

    renderBoard() {
        let gameDiv = document.getElementById("game");
        gameDiv.innerHTML = "";
        let table = document.createElement("table");
        for (let i = 0; i < this.board.size; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < this.board.size; j++) {
                let cell = document.createElement("td");
                if (this.board.revealed[i][j]) {
                    if (this.board.isMine(i, j)) {
                        cell.classList.add("mine");
                    }
                    else if (this.board.isDiamond(i, j)) {
                        cell.classList.add("diamond");
                    }
                    else {
                        cell.classList.add("revealed");
                    }
                }
                cell.addEventListener("click", () => this.revealCell(i, j));
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        gameDiv.appendChild(table);
    }

    updateReward() {
        let reward = this.balance * this.winMultiplier();
        let rewardDiv = document.getElementById("reward");
        rewardDiv.innerHTML = `Next Click Reward: $${reward.toFixed(2)}`;
    }

    checkWin() {
        for (let i = 0; i < this.board.size; i++) {
            for (let j = 0; j < this.board.size; j++) {
                if (this.board.board[i][j] !== 'M' && !this.board.revealed[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
}


export { Mines };





