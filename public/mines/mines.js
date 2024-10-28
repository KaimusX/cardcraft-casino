class Mines {
    constructor(size, mines, initialBalance) {
        this.size = size;
        this.mines = mines;
        this.balance = initialBalance;
        this.board = this.createBoard();
        this.revealed = this.createRevealed();
        this.minesHit = false;
        this.updateBalance();  
        this.placeMines();
        this.renderBoard();
    }

    createBoard() {
        let board = [];
        for (let i = 0; i < this.size; i++) {
            board.push([]);
            for (let j = 0; j < this.size; j++) {
                board[i].push(' ');
            }
        }
        return board;
    }

    createRevealed() {
        let revealed = [];
        for (let i = 0; i < this.size; i++) {
            revealed.push([]);
            for (let j = 0; j < this.size; j++) {
                revealed[i].push(false);
            }
        }
        return revealed;
    }

    placeMines() {
        let placedMines = 0;
        while (placedMines < this.mines) {
            let row = Math.floor(Math.random() * this.size);
            let col = Math.floor(Math.random() * this.size);
            if (this.board[row][col] !== 'M') {
                this.board[row][col] = 'M';
                placedMines++;
            }
        }
    }

    isMine(row, col) {
        return this.board[row][col] === 'M';
    }

    revealCell(row, col) {
        if (this.revealed[row][col]) {
            alert("This cell has already been revealed. Choose another one.");
            return false;
        }
        if (this.isMine(row, col)) {
            alert("You hit a mine! Game over.");
            this.minesHit = true;
            this.revealAll();
            return true;
        }
        this.revealed[row][col] = true;
        this.board[row][col] = 'R';
        this.updateBalance();  
        this.renderBoard();
        return true;
    }

    revealAll() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.revealed[i][j] = true;
            }
        }
        this.renderBoard();
    }

    winMultiplier() {
        let revealedCells = this.revealed.flat().filter(cell => cell).length;
        let mineRatio = this.mines / (this.size * this.size);
        if (mineRatio <= 0.1) {
            return 1 + (revealedCells / (this.size * this.size)) * 4; 
        } else if (mineRatio <= 0.2) {
            return 1 + (revealedCells / (this.size * this.size)) * 7;
        } else {
            return 1 + (revealedCells / (this.size * this.size)) * 9;
        }
    }

    updateBalance() {
        this.balance *= this.winMultiplier();
        let balanceDiv = document.getElementById("balance");
        balanceDiv.innerHTML = `Current Balance: $${this.balance.toFixed(2)}`;
    }

    checkWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] !== 'M' && !this.revealed[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    renderBoard() {
        let gameDiv = document.getElementById("game");
        gameDiv.innerHTML = "";
        let table = document.createElement("table");
        for (let i = 0; i < this.size; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < this.size; j++) {
                let cell = document.createElement("td");
                if (this.revealed[i][j]) {
                    cell.classList.add(this.isMine(i, j) ? "mine" : "revealed");
                    cell.innerHTML = this.isMine(i, j) ? "M" : "";
                }
                cell.addEventListener("click", () => this.revealCell(i, j));
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        gameDiv.appendChild(table);
    }
}

let game;

function startGame() {
    let size = parseInt(document.getElementById("boardSize").value);
    let mines = parseInt(document.getElementById("mineCount").value);
    let initialBalance = parseFloat(document.getElementById("initialBalance").value);
    game = new Mines(size, mines, initialBalance);
}

function quitGame() {
    if (game) {
        game.revealAll();
        alert(`You quit the game. Your total winnings: $${game.balance.toFixed(2)}`);
    }
}



