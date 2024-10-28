import java.util.Random;

public class MinesGame {
    private int size;
    private int mines;
    public double balance;
    private char[][] board;
    private boolean[][] revealed;
    public boolean minesHit;

    public MinesGame(int size, int mines, double initialBalance) {
        this.size = size;
        this.mines = mines;
        this.balance = initialBalance;
        this.board = new char[size][size];
        this.revealed = new boolean[size][size];
        this.minesHit = false;
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                board[i][j] = ' ';
                revealed[i][j] = false;
            }
        }
        placeMines();
    }

    private void placeMines() {
        Random rand = new Random();
        int placedMines = 0;
        while (placedMines < mines) {
            int row = rand.nextInt(size);
            int col = rand.nextInt(size);
            if (board[row][col] != 'M') {
                board[row][col] = 'M';
                placedMines++;
            }
        }
    }

    private boolean isMine(int row, int col) {
        return board[row][col] == 'M';
    }

    public boolean revealCell(int row, int col) {
        if (revealed[row][col]) {
            System.out.println("This cell has already been revealed. Choose another one.");
            return false;
        }

        if (isMine(row, col)) {
            System.out.println("You hit a mine! Game over.");
            minesHit = true;
            displayBoard();
            System.exit(0);
        }

        revealed[row][col] = true;
        board[row][col] = 'R';
        return true;
    }

    public void displayBoard() {
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                System.out.print(board[i][j] + " ");
            }
            System.out.println();
        }
    }

    private double winMultiplier() {
        int revealedCells = 0;
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                if (board[i][j] == 'R') {
                    revealedCells++;
                }
            }
        }

        double mineRatio = (double) mines / (size * size);
        
        if (mineRatio <= 0.1) {
            return 1 + (revealedCells / (double)(size * size)) * 4; // Up to 5x
        } else if (mineRatio <= 0.2) {
            return 1 + (revealedCells / (double)(size * size)) * 7; // Up to 8x
        } else {
            return 1 + (revealedCells / (double)(size * size)) * 9; // Up to 10x
        }
    }

    public void updateBalance() {
        balance *= winMultiplier();
        System.out.printf("Your current balance: $%.2f%n", balance);
    }

    public boolean checkWin() {
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                if (board[i][j] != 'M' && !revealed[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
}