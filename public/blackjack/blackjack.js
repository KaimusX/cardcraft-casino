// Import utilities
import { fetchOrCreateUserBalance, getCurrentUser } from './Sections/utils/firebaseUtils.js';
import { setupGameFunctions, updateDisplay } from './Sections/game/game-section.js';

let playerBalance = 0;

// Function to dynamically load sections
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

// Function to initialize each section
function initializeSection(sectionId) {
    console.log(`Initializing section: ${sectionId}`);
    if (sectionId === 'game-container') {
        setupGameFunctions(); // Game-specific logic
    } else if (sectionId === 'player-container') {
       // setupPlayerFunctions(); // Player-specific logic
    } else if (sectionId === 'dealer-container') {
       // setupDealerFunctions(); // Dealer-specific logic
    }
}

// Function to initialize the game
function initializeGame() {
    getCurrentUser(async (user) => {
        if (user) {
            console.log(`User signed in: ${user.displayName}`);
            playerBalance = await fetchOrCreateUserBalance(user.uid);
            updateDisplay();
        } else {
            console.error("No user signed in. Please sign in to play.");
        }
    });

    // Load sections
    loadSection('dealer-container', './Sections/dealer/dealer-section.html', './Sections/dealer/dealer-section.js');
    loadSection('player-container', './Sections/player/player-section.html', './Sections/player/player-section.js');
    loadSection('game-container', './Sections/game/game-section.html', './Sections/game/game-section.js');
}

// Start the game
initializeGame();