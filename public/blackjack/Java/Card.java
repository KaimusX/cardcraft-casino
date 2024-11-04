public class Card {
    private String suit;  // e.g., "Hearts", "Diamonds", "Clubs", "Spades"
    private String value; // e.g., "2", "3", "4", ..., "10", "Jack", "Queen", "King", "Ace"

    public Card(String suit, String value) {
        this.suit = suit;
        this.value = value;
    }

    public String getSuit() {
        return suit;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value + " of " + suit;
    }
}
