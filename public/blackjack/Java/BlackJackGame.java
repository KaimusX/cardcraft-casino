
@RestController
public class GameController {
    @GetMapping("/card")
    public Card getCard() {
        // Create a new card for demonstration (you can modify this logic)
        Card card = new Card("Hearts", "Ace");
        return card; // Automatically serialized to JSON by Spring Boot
    }
}