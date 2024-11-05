function setupDealerFunctions() {

}

function setupPlayerFunctions() {

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


