
document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.querySelector('.spin-button');
    const betButtons = document.querySelectorAll('.bet-button');
    const betAmountDisplay = document.querySelector('.bet-amount');
    const winAmountDisplay = document.querySelector('.win-amount');
    const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];

    let betAmount = 1; // Default bet amount
    let isSpinning = false;

    // Define symbols for each reel
    const reelSymbols = [
        ['🍒', '🍋', '🍉', '🍊', '🍇', '🍓', '7️⃣', 'BAR', 'Double BAR', 'Triple BAR', '🔔', '⭐️', '💎', '🐎', '💰'],
        ['BAR', '💰', '🍊', '🍓', '7️⃣', '💎', '🍇', 'Double BAR', '🐎', '🍉', '🍒', '🔔', '⭐️', 'Triple BAR', '🍋'],
        ['🐎', '🔔', '🍓', '⭐️', '🍉', '💰', '🍊', 'BAR', '7️⃣', '🍒', '🍋', '🍇', 'Double BAR', '💎', 'Triple BAR']
    ];

    // Update the bet amount display
    function updateBetDisplay() {
        const betAmountText = betAmountDisplay.querySelector('.bet-amount-value');
        betAmountText.textContent = `$${betAmount}`;
    }

    updateBetDisplay();

    // Event listeners for bet adjustment buttons
    betButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const action = e.target.textContent;
            if (action === '+') {
                betAmount += 1;
            } else if (action === '-' && betAmount > 1) {
                betAmount -= 1;
            }
            updateBetDisplay();
        });
    });

    // Event listener for the spin button
    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        spinButton.disabled = true;

        spinReels().then((result) => {
            isSpinning = false;
            spinButton.disabled = false;
            const winnings = calculateWinnings(result);
            winAmountDisplay.textContent = `$${winnings}`;
        });
    });

    // Function to simulate reel spins
    function spinReels() {
        return new Promise((resolve) => {
            let reelResults = [];
            let spinsCompleted = 0;

            reels.forEach((reel, index) => {
                const symbols = reelSymbols[index];
                let spinCount = 0;
                const totalSpins = Math.floor(Math.random() * 10) + 10; // Random spins between 10 and 20
                const spinInterval = setInterval(() => {
                    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                    reel.innerHTML = `<div class="symbol">${randomSymbol}</div>`;
                    spinCount++;
                    if (spinCount >= totalSpins) {
                        clearInterval(spinInterval);
                        reelResults[index] = randomSymbol;
                        spinsCompleted++;
                        if (spinsCompleted === reels.length) {
                            resolve(reelResults);
                        }
                    }
                }, 100 + index * 100);
            });
        });
    }

    // Function to calculate winnings based on the spin result
    function calculateWinnings(result) {
        const payouts = {
            '7️⃣': 100,
            '💰': 50,
            '💎': 30,
            '⭐️': 20,
            '🔔': 10,
            'Triple BAR': 15,
            'Double BAR': 10,
            'BAR': 5,
            '🐎': 8,
            '🍇': 4,
            '🍉': 3,
            '🍓': 2,
            '🍒': 1,
            '🍊': 1,
            '🍋': 1
        };

        let winnings = 0;

        if (result[0] === result[1] && result[1] === result[2]) {
            const symbol = result[0];
            winnings = (payouts[symbol] || 0) * betAmount;
        }

        return winnings;
    }
});
