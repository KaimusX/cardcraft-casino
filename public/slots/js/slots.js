document.addEventListener('DOMContentLoaded', () => {
    const model = new SlotMachineModel();
    const view = new SlotMachineView();
    const controller = new SlotMachineController(model, view);

    // Event listener for the spin button
    document.querySelector('.spin-button').addEventListener('click', () => {
        controller.spinButtonClicked(); // Call spin action when button is clicked
    });

    // Event listeners for bet adjustment buttons
    document.querySelectorAll('.bet-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const action = e.target.textContent.trim();
            controller.updateBetAmount(action); // Update bet amount on button click
        });
    });
 // Modal Functionality
    // Get the modal
    const modal = document.getElementById('rules-modal');

    // Get the button that opens the modal
    const rulesButton = document.querySelector('.rules');

    // Get the <span> element that closes the modal
    const closeButton = document.querySelector('.close-button');

    // Get the button to navigate to home page
    const homeButton = document.querySelector('.home');

    // When the user clicks on the rules button, open the modal
    rulesButton.addEventListener('click', () => {
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        closeButton.focus(); // Move focus to close button
    });

    // Function to close the modal
    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        rulesButton.focus(); // Return focus to rules button
    }

    // When the user clicks on <span> (x), close the modal
    closeButton.addEventListener('click', closeModal);

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // When the user clicks on the home button, redirect to home page
    homeButton.addEventListener('click', () => {
        window.location.href = '../index.html';
    });


});

