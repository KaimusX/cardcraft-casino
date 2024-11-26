import DeckManager from '../utils/DeckManager.js';
import { actions } from '../utils/GameActions.js'; // Button logic is modularized in GameActions.js

const deckManager = DeckManager.getInstance();

// Initialize game buttons and attach actions
function setupGameButtons() {
    document.getElementById("hit-button").addEventListener("click", () => actions.hit.execute());
    document.getElementById("double-button").addEventListener("click", () => actions.double.execute());
    document.getElementById("stand-button").addEventListener("click", () => actions.stand.execute());
    console.log("Game buttons initialized.");
}

// Game-section-specific initialization
export function initializeGameSection() {
    console.log("Initializing game section...");
    setupGameButtons();
}