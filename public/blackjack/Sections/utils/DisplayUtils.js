// DisplayUtils.js
export function updateDisplay(balance) {
    if (isNaN(balance)) {
        console.error("Invalid balance provided:", balance);
        return;
    }

    const balanceElements = document.querySelectorAll(".player-balance-display");
    balanceElements.forEach((element) => {
        element.textContent = `$${balance}`;
    });

    console.log(`Balance updated to: $${balance}`);
}

export function updateCurrentBet(currentBet) {
    if (isNaN(currentBet)) {
        console.error("Invalid bet provided:", currentBet);
        return;
    }

    const betElement = document.getElementById("currentBet");
    if (betElement) {
        betElement.textContent = `$${currentBet}`;
    }

    console.log(`Current Bet updated to: $${currentBet}`);
}