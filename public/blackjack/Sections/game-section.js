function setupGameFunctions() {
    const rulesButton = document.querySelector(".rules-button");
    const rulesModal = document.getElementById("rulesModal");
    const closeButton = document.querySelector(".close-button");
    const hitButton = document.getElementById("hit-button");
    const resetButton = document.getElementById("reset-button"); // Reset button
    const playerCardsContainer = document.getElementById("deckContainer");
    const dealerCardsContainer = document.querySelector(".hand-box"); // Dealer's card container
    const playerScoreDisplay = document.getElementById("playerScore");
    const dealerScoreDisplay = document.getElementById("dealerScore"); // Dealer's score display
    let playerScore = 0;
    let dealerScore = 0;
    let aceCount = 0;

    // Define the deck of cards and image mappings
    const suits = ["spades", "hearts", "diamonds", "clubs"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
    let deck = [];

    // Mapping each card to its image file
    function getCardImageFile(rank, suit) {
        return `${rank}_of_${suit}.png`;
    }

    // Initialize and shuffle the deck
    function initializeDeck() {
        deck = [];
        suits.forEach(suit => {
            ranks.forEach(rank => {
                const displayRank = rank[0].toUpperCase() + rank.slice(1); // Capitalize rank for display
                const card = { rank: displayRank, suit, image: getCardImageFile(rank, suit) };
                deck.push(card);
            });
        });
        deck = shuffleDeck(deck);
    }

    // Shuffle the deck using Fisher-Yates algorithm
    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    // Draw a card from the deck
    function drawCard() {
        return deck.length > 0 ? deck.pop() : null;
    }

    // Calculate card value based on Blackjack rules
    function getCardValue(card) {
        if (["jack", "queen", "king"].includes(card.rank.toLowerCase())) {
            return 10;
        } else if (card.rank.toLowerCase() === "ace") {
            aceCount++;
            return 11; // Aces initially count as 11
        } else {
            return parseInt(card.rank);
        }
    }

    // Adjust for Aces in the score
    function adjustForAces() {
        while (playerScore > 21 && aceCount > 0) {
            playerScore -= 10; // Make an Ace count as 1 instead of 11
            aceCount--;
        }
    }

    // Update the score display
    function updateScoreDisplay() {
        playerScoreDisplay.innerText = playerScore;
    }

    // Update the dealer score display
    function updateDealerScoreDisplay() {
        dealerScoreDisplay.innerText = dealerScore;
    }

    // Reset the game (clear cards, reset scores, and reinitialize the deck)
    function resetGame() {
        // Clear player and dealer cards
        playerCardsContainer.innerHTML = '';
        dealerCardsContainer.innerHTML = '';

        // Reset player and dealer scores
        playerScore = 0;
        dealerScore = 0;
        aceCount = 0;

        // Reset score displays
        updateScoreDisplay();
        updateDealerScoreDisplay();

        // Re-initialize the deck
        initializeDeck();

        // Optionally, deal one card to the dealer (or more depending on your game's rules)
        dealerDrawCard(); // Ensure the dealer draws a card after resetting the game
    }

    // Functionality for the Hit button
    hitButton.addEventListener("click", () => {
        const card = drawCard();

        if (card) {
            // Get card value and add it to the player score
            playerScore += getCardValue(card);
            adjustForAces();
            updateScoreDisplay();

            // Create a new card element with an image for the player
            const cardImg = document.createElement('img');
            cardImg.classList.add('deck-box'); // Add the deck box class for styling
            cardImg.src = `PlayingCards/${card.image}`; // No 'public/' prefix needed

            // Append the new card image to the player cards container
            playerCardsContainer.appendChild(cardImg);
        } else {
            alert("No more cards in the deck!");
        }
    });

    // Functionality for the dealer to draw a card
    function dealerDrawCard() {
        const card = drawCard();
        
        if (card) {
            // Get card value and add it to the dealer score
            dealerScore += getCardValue(card);
            adjustForAces(); // Adjust for aces in the dealer's hand if needed

            // Create a new card element with an image for the dealer
            const cardImg = document.createElement('img');
            cardImg.classList.add('deck-box'); // Add the deck box class for styling
            cardImg.src = `PlayingCards/${card.image}`; // No 'public/' prefix needed

            // Append the new card image to the dealer cards container
            dealerCardsContainer.appendChild(cardImg);

            // Update the dealer score display after drawing a card
            updateDealerScoreDisplay();
        } else {
            alert("No more cards in the deck!");
        }
    }

    // Reset the game when the reset button is clicked
    resetButton.addEventListener("click", () => {
        resetGame();
    });

    // Show the rules modal
    rulesButton.addEventListener("click", () => {
        rulesModal.style.display = "flex";
    });

    // Hide the modal when the close button is clicked
    closeButton.addEventListener("click", () => {
        rulesModal.style.display = "none";
    });

    // Hide the modal when clicking outside of the modal content
    window.addEventListener("click", (event) => {
        if (event.target === rulesModal) {
            rulesModal.style.display = "none";
        }
    });

    // Initialize the deck at the start of the game
    initializeDeck();

    // Only deal cards when the game is reset
    // You can add the first card to the dealer hand here, or have the dealer deal on their turn
    dealerDrawCard(); // This would simulate the dealer drawing one card initially
}

// Call the setup function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", setupGameFunctions);
