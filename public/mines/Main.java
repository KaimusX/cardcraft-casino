
import java.util.Scanner;
    
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter the size of the board: ");
        int size = scanner.nextInt();

        System.out.print("Enter the number of mines: ");
        int mines = scanner.nextInt();

        System.out.print("Enter the amount you want to play with: ");
        double initialBalance = scanner.nextDouble();

        MinesGame game = new MinesGame(size, mines, initialBalance);

        while (true) {
            game.displayBoard();
            System.out.print("Enter row and column separated by space (or type 'quit' to end the game): ");
            String choice = scanner.next();

            if (choice.equalsIgnoreCase("quit")) {
                System.out.printf("Your total winnings: $%.2f%n", game.balance);
                break;
            }

            int row = Integer.parseInt(choice);
            int col = scanner.nextInt();

            if (game.revealCell(row, col)) {
                game.updateBalance();
            }

            if (game.minesHit) {
                System.out.println("You lost all your money! Better luck next time.");
                break;
            }

            if (game.checkWin()) {
                System.out.println("You revealed all safe cells! You win!");
                game.updateBalance();
                break;
            }
        }

        scanner.close();
    }
}
