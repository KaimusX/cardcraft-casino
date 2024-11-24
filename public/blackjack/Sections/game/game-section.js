import DeckManager from '../utils/DeckManager.js';

export function setupGameFunctions() {
    console.log("Game functions initialized");

    // Initialize Singleton DeckManager
    const deckManager = DeckManager.getInstance();
    deckManager.initializeDeck();

    // DOM Elements
    const hitButton = document.getElementById("hit-button");
    const doubleButton = document.getElementById("double-button");
    const standButton = document.getElementById("stand-button");
    const resetButton = document.getElementById("reset-button");
    const betInput = document.getElementById("betInput");
    const betButton = document.querySelector(".bet-button");
    const playerBalanceDisplay = document.getElementById("playerBalance");
    const currentBetDisplay = document.getElementById("currentBet");
    const playerCardsContainer = document.getElementById("deckContainer");
    const rulesButton = document.querySelector(".rules-button");
    const rulesModal = document.getElementById("rulesModal");
    const closeButton = document.querySelector(".close-button");


    // Game State
    let playerBalance = 100; // Initial balance
    let currentBet = 0;
    let playerScore = 0;

    // Functions
    function updateDisplay() {
        playerBalanceDisplay.textContent = `$${playerBalance}`;
        currentBetDisplay.textContent = `$${currentBet}`;
    }

    function getCardValue(card) {
        if (["jack", "queen", "king"].includes(card.rank)) return 10;
        if (card.rank === "ace") return 11; // Simplified for now
        return parseInt(card.rank);
    }

    function handleHit() {
        const card = deckManager.drawCard();
        if (card) {
            playerScore += getCardValue(card);
            const cardImg = document.createElement("img");
            cardImg.src = `PlayingCards/${card.image}`;
            cardImg.classList.add("card");
            playerCardsContainer.appendChild(cardImg);
            console.log(`Player Score: ${playerScore}`);
        }
    }

    function setBet() {
        const bet = parseInt(betInput.value);
        if (bet > 0 && bet <= playerBalance) {
            currentBet = bet;
            playerBalance -= bet;
            updateDisplay();
            console.log(`Bet placed: $${currentBet}`);
        } else {
            alert("Invalid bet amount.");
        }
    }

    function handleReset() {
        currentBet = 0;
        playerScore = 0;
        playerCardsContainer.innerHTML = ""; // Clear cards
        deckManager.initializeDeck(); // Reset the deck
        updateDisplay();
        console.log("Game reset.");
    }

    function toggleRulesModal() {
        rulesModal.style.display = rulesModal.style.display === "block" ? "none" : "block";
    }

    // Event Listeners
    hitButton.addEventListener("click", handleHit);
    betButton.addEventListener("click", setBet);
    resetButton.addEventListener("click", handleReset);
    rulesButton.addEventListener("click", toggleRulesModal);
    closeButton.addEventListener("click", toggleRulesModal);

    // Initialize Display
    updateDisplay();
}
