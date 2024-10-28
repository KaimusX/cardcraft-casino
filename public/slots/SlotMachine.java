// SlotMachine.java

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class SlotMachine {
    private static final List<String>[] reelSymbols = new List[]{
            Arrays.asList("🍒", "🍋", "🍉", "🍊", "🍇", "🍓", "7️⃣", "BAR", "Double BAR", "Triple BAR", "🔔", "⭐️", "💎", "🐎", "💰"),
            Arrays.asList("BAR", "💰", "🍊", "🍓", "7️⃣", "💎", "🍇", "Double BAR", "🐎", "🍉", "🍒", "🔔", "⭐️", "Triple BAR", "🍋"),
            Arrays.asList("🐎", "🔔", "🍓", "⭐️", "🍉", "💰", "🍊", "BAR", "7️⃣", "🍒", "🍋", "🍇", "Double BAR", "💎", "Triple BAR")
    };

    private static final Map<String, Integer> payouts = new HashMap<>();
    static {
        payouts.put("7️⃣", 100);
        payouts.put("💰", 50);
        payouts.put("💎", 30);
        payouts.put("⭐️", 20);
        payouts.put("🔔", 10);
        payouts.put("Triple BAR", 15);
        payouts.put("Double BAR", 10);
        payouts.put("BAR", 5);
        payouts.put("🐎", 8);
        payouts.put("🍇", 4);
        payouts.put("🍉", 3);
        payouts.put("🍓", 2);
        payouts.put("🍒", 1);
        payouts.put("🍊", 1);
        payouts.put("🍋", 1);
    }

    private static final Random random = new Random();

    public String[] spinReels() {
        String[] result = new String[3];
        for (int i = 0; i < 3; i++) {
            List<String> symbols = reelSymbols[i];
            int randomIndex = random.nextInt(symbols.size());
            result[i] = symbols.get(randomIndex);
        }
        return result;
    }

    public int calculateWinnings(String[] result, int betAmount) {
        int winnings = 0;
        if (result[0].equals(result[1]) && result[1].equals(result[2])) {
            int payout = payouts.getOrDefault(result[0], 0);
            winnings = payout * betAmount;
        }
        return winnings;
    }

    // Example usage
    public static void main(String[] args) {
        SlotMachine slotMachine = new SlotMachine();
        int betAmount = 1; // Example bet amount
        String[] result = slotMachine.spinReels();
        int winnings = slotMachine.calculateWinnings(result, betAmount);
        System.out.println("Spin Result: " + Arrays.toString(result));
        System.out.println("Winnings: $" + winnings);
    }
}
