from mines.MinesGame import MinesGame


chooseGame = int(input("Enter what game you want to play: 1. Mines "))


if (chooseGame == 1):
    size = int(input("Enter the size of the board: "))
    mines = int(input("Enter the number of mines: "))
    initial_balance = float(input("Enter the amount you want to play with: "))
    game = MinesGame(size, mines, initial_balance)

    while True:
        game.display_board()
        choice = input("Enter row and column separated by space (or type 'quit' to end the game): ")
            
        if choice.lower() == 'quit':
            print(f"Your total winnings: ${game.balance:.2f}")
            break

        row, col = map(int, choice.split())
        if game.reveal_cell(row, col):
            game.update_balance()

        if game.mines_hit:
            print("You lost all your money! Better luck next time.")
            break

        if game.check_win():
            print("You revealed all safe cells! You win!")
            #game.update_balance()
            print(f"Your current balance: ${game.balance:.2f}")
            break