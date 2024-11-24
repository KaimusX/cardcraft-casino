// Function to dynamically load sections into containers
export function loadSection(containerId, file, script) {
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

// Initialize section-specific functionality
function initializeSection(sectionId) {
    console.log(`Initializing section: ${sectionId}`);
    if (sectionId === 'dealer-container') {
        // setupDealerFunctions(); // Future implementation
    } else if (sectionId === 'player-container') {
        // setupPlayerFunctions(); // Future implementation
    } else if (sectionId === 'game-container') {
        if (window.setupGameFunctions) {
            window.setupGameFunctions(); // Ensure game logic runs after loading
        } else {
            console.error("setupGameFunctions is not defined");
        }
    }
}

// Load all sections
loadSection('dealer-container', 'Sections/dealer/dealer-section.html', 'Sections/dealer/dealer-section.js');
loadSection('player-container', 'Sections/player/player-section.html', 'Sections/player/player-section.js');
loadSection('game-container', 'Sections/game/game-section.html', 'Sections/game/game-section.js');
