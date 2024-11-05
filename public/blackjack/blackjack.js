function setupDealerFunctions() {

}

function setupPlayerFunctions() {
    const deckContainer = document.getElementById('deckContainer');
    const addCardButton = document.getElementById('addCardButton');
    
    let cardCount = 0; // To keep track of the number of cards
    
    addCardButton.addEventListener('click', () => {
        cardCount++; // Increment card count
    
        // Create a new card element
        const newCard = document.createElement('div');
        newCard.classList.add('deck-box'); // Add the deck box class
    
        // Append the new card to the deck container
        deckContainer.appendChild(newCard);
    });
}

function setupGameFunctions() {
    const rulesButton = document.querySelector(".rules-button");
    const rulesModal = document.getElementById("rulesModal");
    const closeButton = document.querySelector(".close-button");

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
}


