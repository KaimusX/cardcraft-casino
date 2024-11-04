function setupDealerFunctions() {
    // Example of adding event listeners or initializing dealer-specific functionality
    const dealerPopupButton = document.querySelector('#dealer-popup-button');

    if (dealerPopupButton) {
        dealerPopupButton.addEventListener('click', () => {
            alert('This is a popup message!');
        });
    } else {
        console.error('Dealer popup button not found');
    }
}

function setupPlayerFunctions() {

}

function setupGameFunctions() {

}


