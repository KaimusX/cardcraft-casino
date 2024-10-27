import random

class MinesGame:
    def __init__(self, size, mines, initial_balance):
        self.size = size
        self.mines = mines
        self.balance = initial_balance
        self.board = [[' ' for _ in range(size)] for _ in range(size)]
        self.revealed = [[False for _ in range(size)] for _ in range(size)]
        self.place_mines()
        self.mines_hit = False

    def place_mines(self):
        placed_mines = 0
        while placed_mines < self.mines:
            row = random.randint(0, self.size - 1)
            col = random.randint(0, self.size - 1)
            if self.board[row][col] != 'M':
                self.board[row][col] = 'M'
                placed_mines += 1

    def reveal_cell(self, row, col):
        if self.revealed[row][col]:
            print("This cell has already been revealed. Choose another one.")
            return False  # Indicate that no new cell was revealed

        if self.is_mine(row, col):
            print("You hit a mine! Game over.")
            self.mines_hit = True
            self.display_board()
            exit()

        self.revealed[row][col] = True
        self.board[row][col] = 'R'
        return True  # Indicate that a new cell was revealed

    def is_mine(self, row, col):
        return self.board[row][col] == 'M'

    def display_board(self):
        for row in self.board:
            print(' '.join(row))
    
    def win_multiplier(self):
        revealed_cells = sum([row.count('R') for row in self.board])
        mine_ratio = self.mines / (self.size * self.size)
        
        if mine_ratio <= 0.1:
            return 1 + (revealed_cells / (self.size * self.size)) * 4  # Up to 5x
        elif mine_ratio <= 0.2:
            return 1 + (revealed_cells / (self.size * self.size)) * 7  # Up to 8x
        else:
            return 1 + (revealed_cells / (self.size * self.size)) * 9  # Up to 10x

    def update_balance(self):
        self.balance *= self.win_multiplier()
        print(f"Your current balance: ${self.balance:.2f}")

    def check_win(self):
        return all(self.revealed[row][col] or self.is_mine(row, col)
                   for row in range(self.size) for col in range(self.size))