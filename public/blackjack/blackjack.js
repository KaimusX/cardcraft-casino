// Import utilities
import { fetchOrCreateUserBalance, getCurrentUser } from './Sections/utils/firebaseUtils.js';
import { updateDisplay } from './Sections/utils/DisplayUtils.js';
import { actions } from './Sections/utils/GameActions.js';
import { showBetModal } from './Sections/utils/ModalUtils.js';

// BlackjackFacade: Simplifies interaction with various game subsystems
const BlackjackFacade = (() => {
    let playerBalance = 0;

    // Private: Initialize Player Balance
    async function initializePlayerBalance() {
        try {
            const user = await getCurrentUser();
            if (user) {
                console.log(`User signed in: ${user.displayName}`);
                playerBalance = await fetchOrCreateUserBalance(user.uid);
                updateDisplay(playerBalance); // Update the balance display
            } else {
                console.error("No user signed in. Please sign in to play.");
            }
        } catch (error) {
            console.error("Error initializing player balance:", error);
        }
    }

    // Private: Load HTML and initialize sections
    function loadSection(containerId, file, script) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                document.getElementById(containerId).innerHTML = data;

                if (script) {
                    const scriptElement = document.createElement('script');
                    scriptElement.type = 'module';
                    scriptElement.src = script;
                    scriptElement.onload = () => initializeSection(containerId);
                    document.body.appendChild(scriptElement);
                } else {
                    initializeSection(containerId);
                }
            })
            .catch(error => console.error(`Error loading section (${containerId}):`, error));
    }

    function initializeSection(sectionId) {
        switch (sectionId) {
            case 'game-container':
                setupGameButtons();
                const betModal = document.getElementById('betModal');
                if (betModal) {
                    showBetModal(playerBalance); // Show bet modal
                } else {
                    console.error("Bet modal not found in the DOM.");
                }
                break;
            default:
                console.error(`Unknown section: ${sectionId}`);
        }
    }
    

    // Private: Setup game buttons
    function setupGameButtons() {
        document.getElementById("hit-button").addEventListener("click", () => actions.hit.execute());
        document.getElementById("reset-button").addEventListener("click", () => actions.reset.execute());
        document.getElementById("double-button").addEventListener("click", () => actions.double.execute());
        document.getElementById("stand-button").addEventListener("click", () => actions.stand.execute());
        console.log("Game buttons initialized.");
    }

    // Public: Start the game
    async function startGame() {
        await initializePlayerBalance();

        
        // Load sections dynamically
        loadSection('dealer-container', './Sections/dealer/dealer-section.html', './Sections/dealer/dealer-section.js');
        loadSection('player-container', './Sections/player/player-section.html', './Sections/player/player-section.js');
        loadSection('game-container', './Sections/game/game-section.html', './Sections/game/game-section.js');
    }

    return {
        startGame,
    };
})();

// Start the game via the BlackjackFacade
BlackjackFacade.startGame();
