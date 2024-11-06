document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.querySelector('.spin-button');
    const betButtons = document.querySelectorAll('.bet-button');
    const betAmountDisplay = document.querySelector('.bet-amount');
    const winAmountDisplay = document.querySelector('.win-amount');
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    let betAmount = 1; // Default bet amount
    let isSpinning = false;

    // Define symbols for each reel (BAR symbols removed)
    const reelSymbols = [
        ['🍒', '🍋', '🍉', '🍊', '🍇', '🍓', '7️⃣', '🔔', '⭐️', '💎', '🐎', '💰'],
        ['💰', '🍊', '🍓', '7️⃣', '💎', '🍇', '🐎', '🍉', '🍒', '🔔', '⭐️', '🍋'],
        ['🐎', '🔔', '🍓', '⭐️', '🍉', '💰', '🍊', '7️⃣', '🍒', '🍋', '🍇', '💎']
    ];

    // Update the bet amount display
    function updateBetDisplay() {
        betAmountDisplay.textContent = `$${betAmount}`;
    }

    updateBetDisplay();

    // Event listeners for bet adjustment buttons
    betButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const action = e.target.textContent.trim();
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
        winAmountDisplay.textContent = `$0`; // Reset win amount on each spin

        spinReels().then((result) => {
            isSpinning = false;
            spinButton.disabled = false;
            const winnings = calculateWinnings(result);
            winAmountDisplay.textContent = `$${winnings}`;
        });
    });

    // Updated spinReels function without BAR handling
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

                    // Get current symbols
                    const currentSymbols = Array.from(reel.children);

                    // Shift symbols: bottom symbol becomes previous symbol, etc.
                    // Update from bottom to top to prevent overwrite
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
                        // The middle symbol is now the final symbol after spinning
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

    // Updated payouts without BAR entries
    function calculateWinnings(result) {
        const payouts = {
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

        let winnings = 0;

        if (result[0] === result[1] && result[1] === result[2]) {
            const symbol = result[0];
            winnings = (payouts[symbol] || 0) * betAmount;

            // Add 'win' class to the winning symbols (middle symbols)
            reels.forEach((reel) => {
                const symbolDiv = reel.children[1]; // Middle symbol
                symbolDiv.classList.add('win');
            });
        } else {
            // Remove 'win' class if not a winning spin
            reels.forEach((reel) => {
                const symbolDiv = reel.children[1]; // Middle symbol
                symbolDiv.classList.remove('win');
            });
        }

        return winnings;
    }
});
