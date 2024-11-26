import DeckManager from '../utils/DeckManager.js';
import { fetchOrCreateUserBalance, getCurrentUser } from '../utils/firebaseUtils.js';

// Update all relevant displays
export function updateDisplay(balance = playerBalance) {
    if (typeof balance !== "number") {
        console.error("Invalid balance provided to updateDisplay:", balance);
        return;
    }

    const modalBalanceDisplay = document.querySelector("#betModal .player-balance-display");
    if (modalBalanceDisplay) modalBalanceDisplay.textContent = `$${balance}`;
    console.log("Updated display balance to:", balance);
}


export function setupGameFunctions() {
    const deckManager = DeckManager.getInstance();
    deckManager.initializeDeck();

    // DOM Elements
    const hitButton = document.getElementById("hit-button");
    const resetButton = document.getElementById("reset-button");
    const rulesButton = document.querySelector(".rules-button");
    const closeButton = document.querySelector(".close-button");
    const betModal = document.getElementById("betModal");
    const placeBetButton = document.getElementById("placeBetButton");
    const betInput = document.getElementById("betInput");
    const rulesModal = document.getElementById("rulesModal");

    // Game State
    let playerBalance = 0; // Example initial balance
    let currentBet = 0;
    let playerScore = 0;

    // Functions
    // Show the betting modal
    function showBetModal() {
        const betModal = document.getElementById('betModal');
        const balanceDisplay = document.querySelector("#betModal .player-balance-display");
    
        if (balanceDisplay) balanceDisplay.textContent = `$${playerBalance}`;
    
        betModal.classList.add('visible');
    }
    
    function hideBetModal() {
        const betModal = document.getElementById('betModal');
        betModal.classList.remove('visible');
    }
    

    // Toggle the rules modal
    function toggleRulesModal() {
        rulesModal.style.display = rulesModal.style.display === "block" ? "none" : "block";
    }

    // Handle hit button logic
    function handleHit() {
        const card = deckManager.drawCard();
        if (card) {
            playerScore += ["jack", "queen", "king"].includes(card.rank)
                ? 10
                : card.rank === "ace"
                    ? 11
                    : parseInt(card.rank);

            const cardImg = document.createElement("img");
            cardImg.src = `PlayingCards/${card.image}`;
            cardImg.classList.add("card");
            document.getElementById("deckContainer").appendChild(cardImg);

            console.log(`Player Score: ${playerScore}`);
        }
    }


    function handlePlaceBet() {
        const bet = parseInt(betInput.value);

        console.log("PLACE BET Button Clicked");
        if (isNaN(bet) || bet <= 0 || bet > playerBalance) {
            alert("Please enter a valid bet amount within your balance.");
            return;
        }

        currentBet = bet;
        playerBalance -= bet;
        setBalanceDisplay(playerBalance); // Updates both balance displays
        console.log(`Bet placed: $${currentBet}, Balance after bet: $${playerBalance}`);
        hideBetModal();
    }


    // Handle resetting the game
    function handleReset() {
        // Refund the current bet to the player's balance
        playerBalance += currentBet;
        currentBet = 0;
        playerScore = 0;
    
        // Clear the deck and reinitialize it
        document.getElementById("deckContainer").innerHTML = ""; 
        deckManager.initializeDeck(); 
    
        // Update the balance display
        updateDisplay(playerBalance);
    
        // Log the reset
        console.log("Game reset. Balance refunded:", playerBalance);
    
        // Show the betting modal to allow placing a new bet
        showBetModal();
    }
    

    async function initializePlayerBalance() {
        try {
            const user = await getCurrentUser();
            if (user) {
                console.log(`User signed in: ${user.displayName}`);
                const balance = await fetchOrCreateUserBalance(user.uid);
                console.log("Initialized balance:", balance);
                setPlayerBalance(balance); // Update balance globally and on display
            } else {
                console.error("No user signed in.");
                setPlayerBalance(0); // Fallback to default
            }
        } catch (error) {
            console.error("Error initializing player balance:", error);
            setPlayerBalance(0);
        }
    }
    
    function setPlayerBalance(balance) {
        if (typeof balance !== "number") {
            console.error("Invalid balance type:", balance);
            return;
        }
        playerBalance = balance; // Update global playerBalance
        updateDisplay(playerBalance); // Update the display
    }
    
    
    function setBalanceDisplay(balance) {
        if (isNaN(balance)) {
            console.error("Invalid balance value:", balance);
            return;
        }
        const balanceElements = document.querySelectorAll(".player-balance-display");
        balanceElements.forEach((element) => {
            element.textContent = `$${balance}`;
        });
        console.log(`Balance updated to: $${balance}`);
    }
    
    
    
    // Event Listeners
    hitButton.addEventListener("click", handleHit);
    resetButton.addEventListener("click", handleReset);
    rulesButton.addEventListener("click", toggleRulesModal);
    closeButton.addEventListener("click", toggleRulesModal);
    placeBetButton.addEventListener("click", handlePlaceBet);

    // Initialize modal on load
    window.addEventListener("load", async () => {
        await initializePlayerBalance();
        showBetModal();
    });

    // Initialize the display
    updateDisplay();
}