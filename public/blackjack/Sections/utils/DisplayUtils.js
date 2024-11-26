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
