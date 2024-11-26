class SlotMachineModel {
    constructor() {
        this.reelSymbols = [
            ['🍒', '🍋', '🍉', '🍊', '🍇', '🍓', '7️⃣', '🔔', '⭐️', '💎', '🐎', '💰'],
            ['💰', '🍊', '🍓', '7️⃣', '💎', '🍇', '🐎', '🍉', '🍒', '🔔', '⭐️', '🍋'],
            ['🐎', '🔔', '🍓', '⭐️', '🍉', '💰', '🍊', '7️⃣', '🍒', '🍋', '🍇', '💎']
        ];
        this.payouts = {
            '7️⃣': 100,
            '💰': 50,
            '💎': 30,
            '⭐️': 20,
            '🔔': 10,
            '🐎': 8,
            '🍇': 4,
            '🍉': 3,
            '🍓': 2,
            '🍒': 1,
            '🍊': 1,
            '🍋': 1
        };
        this.betAmount = 1; // Default bet amount
    }

    setBetAmount(amount) {
        this.betAmount = amount;
    }

    getBetAmount() {
        return this.betAmount;
    }

    spinReels() {
        return new Promise((resolve) => {
            let reelResults = [];
            let spinsCompleted = 0;

            const reels = document.querySelectorAll('.reel'); // Assuming your reels have the class 'reel'
            reels.forEach((reel, index) => {
                const symbols = this.reelSymbols[index];
                let spinCount = 0;
                const totalSpins = Math.floor(Math.random() * 10) + 10; // Random spins between 10 and 20

                const spinInterval = setInterval(() => {
                    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

                    // Get current symbols
                    const currentSymbols = Array.from(reel.children);

                    // Shift symbols
                    currentSymbols[2].className = currentSymbols[1].className;
                    currentSymbols[2].innerHTML = currentSymbols[1].innerHTML;

                    currentSymbols[1].className = currentSymbols[0].className;
                    currentSymbols[1].innerHTML = currentSymbols[0].innerHTML;

                    // Set new symbol at the top
                    currentSymbols[0].className = 'symbol';
                    currentSymbols[0].innerHTML = `${randomSymbol}<span class="sr-only">${randomSymbol}</span>`;

                    spinCount++;
                    if (spinCount >= totalSpins) {
                        clearInterval(spinInterval);
                        reelResults[index] = reel.children[1].textContent.trim();
                        spinsCompleted++;
                        if (spinsCompleted === reels.length) {
                            resolve(reelResults);
                        }
                    }
                }, 100 + index * 100);
            });
        });
    }

    calculateWinnings(result) {
        let winnings = 0;
        if (result[0] === result[1] && result[1] === result[2]) {
            const symbol = result[0];
            winnings = (this.payouts[symbol] || 0) * this.betAmount;
        }
        return winnings;
    }
}