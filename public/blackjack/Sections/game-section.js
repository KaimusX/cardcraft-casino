function setupGameFunctions() {
    const rulesButton = document.querySelector(".rules-button");
    const rulesModal = document.getElementById("rulesModal");
    const closeButton = document.querySelector(".close-button");
    const hitButton = document.getElementById("hit-button");
    const playerCardsContainer = document.getElementById("deckContainer"); // Reference to the player cards container
    let cardCount = 0; // Counter for the number of cards added

    // Show the rules modal
    rulesButton.addEventListener("click", () => {
        rulesModal.style.display = "flex"; // Display as flex to center content
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

    // Functionality for the Hit button
    hitButton.addEventListener("click", () => {
        cardCount++; // Increment the card count

        // Create a new card element
        const newCard = document.createElement('div');
        newCard.classList.add('deck-box'); // Add the deck box class
        //newCard.innerText = `Card ${cardCount}`; // Example text for the card

        // Append the new card to the player cards container
        playerCardsContainer.appendChild(newCard);
    });
}

// Call the setup function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", setupGameFunctions);