import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Deck {
    private List<Card> cards; // This is the relationship, Deck contains Cards

    public Deck() {
        this.cards = new ArrayList<>();
        String[] suits = {"Hearts", "Diamonds", "Clubs", "Spades"};
        String[] values = {"2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"};

        for (String suit : suits) {
            for (String value : values) {
                cards.add(new Card(suit, value)); // Creating Card objects
            }
        }
        shuffle(); // Shuffle the deck upon creation
    }

    public void shuffle() {
        Collections.shuffle(cards);
    }

}
