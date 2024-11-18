class Board {
    constructor(size, mines) {
        this.size = size;
        this.mines = mines;
        this.board = this.createBoard();
        this.revealed = this.createRevealed();
        this.placeMines(); 
    }

    createBoard() {
        return Array.from({ length: this.size }, () => Array(this.size).fill(' '));
    }

    createRevealed() {
        return Array.from({ length: this.size }, () => Array(this.size).fill(false));
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
        this.revealed[row][col] = true;
        return this.isMine(row, col);
    }

    revealAll() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.revealed[i][j] = true;
            }
        }
    }
}

export { Board };

