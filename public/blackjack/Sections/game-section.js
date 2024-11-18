function setupGameFunctions() {
    const rulesButton = document.querySelector(".rules-button");
    const rulesModal = document.getElementById("rulesModal");
    const closeButton = document.querySelector(".close-button");
    const hitButton = document.getElementById("hit-button");
    const resetButton = document.getElementById("reset-button"); // Reset button
    const standButton = document.getElementById("stand-button"); // Stand button
    const playerCardsContainer = document.getElementById("deckContainer");
    const dealerCardsContainer = document.querySelector(".hand-box"); // Dealer's card container
    const playerScoreDisplay = document.getElementById("playerScore");
    const dealerScoreDisplay = document.getElementById("dealerScore"); // Dealer's score display
    const doubleButton = document.getElementById("double-button"); // Double button

    let playerScore = 0;
    let dealerScore = 0;
    let aceCount = 0;
    let gameInProgress = false; // Track if the game is in progress or not

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

    // Reset the player bet and balance to defaults (called from player-section.js)
    function resetPlayerState() {
        currentBet = 0;  // Reset the current bet
        playerBalance = 100;  // Reset the player's balance back to 100
        document.getElementById("currentBet").textContent = `$${currentBet}`;  // Update the displayed bet
        document.getElementById("playerBalance").textContent = `$${playerBalance}`;  // Update the displayed balance
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

        // Reset player bet and balance
        resetPlayerState();  // Reset bet and balance to defaults

        // Disable the hit button until a bet is placed
        hitButton.disabled = true;

        // Show the bet box again (if hidden)
        document.getElementById("betInput").style.display = 'block';
        document.querySelector("button").style.display = 'block';

        // Create a placeholder card (white card) for dealer, with the same deck-box class
        const placeholderCard = document.createElement('div');
        placeholderCard.classList.add('deck-box'); // Use the same class as the actual cards
        dealerCardsContainer.appendChild(placeholderCard);

        gameInProgress = false; // Reset game status
    }

    // Functionality for the Hit button
    hitButton.addEventListener("click", () => {
        if (currentBet > 0) { // Only allow the hit action if a bet has been placed
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
        }
    });

    // Functionality for the dealer to draw a card
    function dealerDrawCard(revealCard = true) {
        const card = drawCard();
        
        if (card) {
            // Get card value and add it to the dealer score
            dealerScore += getCardValue(card);
            adjustForAces(); // Adjust for aces in the dealer's hand if needed

            // Create a new card element with an image for the dealer
            const cardImg = document.createElement('img');
            cardImg.classList.add('deck-box'); // Add the deck box class for styling
            
            if (revealCard) {
                // Show the real card image if the bet is placed
                cardImg.src = `PlayingCards/${card.image}`;
            } else {
                // Initially show a white placeholder card
                cardImg.src = "PlayingCards/placeholder.png"; // Placeholder image (create a simple white card image)
            }

            // Append the new card image to the dealer cards container
            dealerCardsContainer.appendChild(cardImg);

            // Update the dealer score display after drawing a card
            updateDealerScoreDisplay();
        } else {
            alert("No more cards in the deck!");
        }
    }

    // Handle the reset button click
    resetButton.addEventListener("click", () => {
        resetGame();
    });

    // Handle the stand button click
    standButton.addEventListener("click", () => {
        if (gameInProgress) {
            // Disable the hit button after player stands
            hitButton.disabled = true;

            // Reveal dealer's card
            dealerDrawCard(true);

            // Dealer's turn: Keep drawing until the dealer's score is 17 or higher
            while (dealerScore < 17) {
                dealerDrawCard(true);
            }

            // Check the winner (basic check)
            if (playerScore > 21) {
                alert("You busted! Dealer wins!");
            } else if (dealerScore > 21) {
                alert("Dealer busted! You win!");
            } else if (playerScore > dealerScore) {
                alert("You win!");
            } else if (playerScore < dealerScore) {
                alert("Dealer wins!");
            } else {
                alert("It's a tie!");
            }

            // End the game
            gameInProgress = false;
        }
    });

    // Show the rules modal
    rulesButton.addEventListener("click", () => {
        rulesModal.style.display = "flex";
    });

    // Hide the modal when the close button is clicked
    closeButton.addEventListener("click", () => {
        rulesModal.style.display = "none";
    });

    doubleButton.addEventListener("click", () => {
        if (currentBet > 0 && gameInProgress) {
            // Double the player's bet
            currentBet *= 2;
    
            // Update bet and balance displays
            document.getElementById("currentBet").textContent = `$${currentBet}`;
            document.getElementById("playerBalance").textContent = `$${playerBalance}`;
    
            // Draw one additional card and automatically stand
            const card = drawCard();
            if (card) {
                playerScore += getCardValue(card);
                adjustForAces();
                updateScoreDisplay();
    
                // Create and append the new card image for the player
                const cardImg = document.createElement('img');
                cardImg.classList.add('deck-box');
                cardImg.src = `PlayingCards/${card.image}`;
                playerCardsContainer.appendChild(cardImg);
            }
    
            // Disable the double button after using it
            doubleButton.disabled = true;
    
            // Stand automatically after doubling
            standButton.click();
        }
    });

    // Hide the modal when clicking outside of the modal content
    window.addEventListener("click", (event) => {
        if (event.target === rulesModal) {
            rulesModal.style.display = "none";
        }
    });

    // Initialize the deck at the start of the game
    initializeDeck();

    // Disable the hit button until a bet is placed
    hitButton.disabled = true;

    // Listen for a bet placement from player-section.js
    document.querySelector("button").addEventListener("click", () => {
        if (currentBet > 0) {
            // Enable the hit button when a valid bet is placed
            hitButton.disabled = false;

            // Reveal the dealer's card once the bet is placed
            dealerDrawCard(false); // Initially show the placeholder card for dealer
            gameInProgress = true; // Mark the game as in progress
        }
    });
}

// Call the setup function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", setupGameFunctions);
