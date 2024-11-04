import java.util.ArrayList;
import java.util.List;

public class BlackJackPlayer {
    private String name;  // Player's name
    private List<Card> hand;  // Player's hand of cards

    public BlackJackPlayer(String name) {
        this.name = name;
        this.hand = new ArrayList<>();  // Initialize hand
    }

    // Method to add a card to the player's hand
    public void addCard(Card card) {
        hand.add(card);  // Add card to hand
    }

    // Getters for player's hand
    public List<Card> getHand() {
        return hand;  // Return the list of cards
    }

    @Override
    public String toString() {
        return name + "'s hand: " + hand;
    }
}
