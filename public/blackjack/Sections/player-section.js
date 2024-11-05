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