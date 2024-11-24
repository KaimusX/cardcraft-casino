console.log("game-section.js script loaded");

import DeckManager from '../utils/DeckManager.js';

function setupGameFunctions() {
    console.log("Game functions initialized");
    const deckManager = DeckManager.getInstance(); // Singleton connection 
    const hitButton = document.getElementById("hit-button");
    console.log("Hit Button:", hitButton);
    const playerCardsContainer = document.getElementById("deckContainer");
    const playerScoreDisplay = document.getElementById("playerScore");

    if (!hitButton) {
        console.error("Hit button not found in the DOM");
    }

    // const rulesButton = document.querySelector(".rules-button");
    // const rulesModal = document.getElementById("rulesModal");
    // const closeButton = document.querySelector(".close-button");

    // const resetButton = document.getElementById("reset-button");
    // const standButton = document.getElementById("stand-button");
    // const doubleButton = document.getElementById("double-button");
    // const dealerCardsContainer = document.querySelector(".hand-box");
    // const dealerScoreDisplay = document.getElementById("dealerScore");

    let playerScore = 0;

    function updateScoreDisplay() {
        playerScoreDisplay.innerText = playerScore;
    }

    function getCardValue(card) {
        if (["jack", "queen", "king"].includes(card.rank)) {
            return 10;
        } else if (card.rank === "ace") {
            return 11; // Handle aces later for adjustment
        } else {
            return parseInt(card.rank);
        }
    }

    hitButton.addEventListener("click", () => {
        const card = deckManager.drawCard();
        console.log("Hit button clicked!");
        if (card) {
            playerScore += getCardValue(card);
            updateScoreDisplay();
            const cardImg = document.createElement("img");
            cardImg.src = `PlayingCards/${card.image}`;
            cardImg.classList.add("deck-box");
            playerCardsContainer.appendChild(cardImg);
        }
    });

    // let dealerScore = 0;
    // let aceCount = 0;
    // let gameInProgress = false;

    // const observers = []; // Array to hold observers

    // // Add an observer
    // function addObserver(observer) {
    //     observers.push(observer);
    // }

    // // Notify all observers about state changes
    // function notifyObservers(event, data) {
    //     observers.forEach(observer => observer.update(event, data));
    // }

    // // Initialize and shuffle the deck
    // const suits = ["spades", "hearts", "diamonds", "clubs"];
    // const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
    // let deck = [];

    // function getCardImageFile(rank, suit) {
    //     return `${rank}_of_${suit}.png`;
    // }

    // function initializeDeck() {
    //     deck = [];
    //     suits.forEach(suit => {
    //         ranks.forEach(rank => {
    //             const displayRank = rank[0].toUpperCase() + rank.slice(1);
    //             const card = { rank: displayRank, suit, image: getCardImageFile(rank, suit) };
    //             deck.push(card);
    //         });
    //     });
    //     deck = shuffleDeck(deck);
    // }

    // function shuffleDeck(deck) {
    //     for (let i = deck.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [deck[i], deck[j]] = [deck[j], deck[i]];
    //     }
    //     return deck;
    // }

    // function drawCard() {
    //     return deck.length > 0 ? deck.pop() : null;
    // }

    // function getCardValue(card) {
    //     if (["jack", "queen", "king"].includes(card.rank.toLowerCase())) {
    //         return 10;
    //     } else if (card.rank.toLowerCase() === "ace") {
    //         aceCount++;
    //         return 11;
    //     } else {
    //         return parseInt(card.rank);
    //     }
    // }

    // function adjustForAces() {
    //     while (playerScore > 21 && aceCount > 0) {
    //         playerScore -= 10;
    //         aceCount--;
    //     }
    // }


    // function updateDealerScoreDisplay() {
    //     dealerScoreDisplay.innerText = dealerScore;
    // }

    // function resetGame() {
    //     playerCardsContainer.innerHTML = '';
    //     dealerCardsContainer.innerHTML = '';
    //     playerScore = 0;
    //     dealerScore = 0;
    //     aceCount = 0;
    //     updateScoreDisplay();
    //     updateDealerScoreDisplay();
    //     initializeDeck();
    //     notifyObservers("reset", {});
    //     gameInProgress = false;
    // }

    // resetButton.addEventListener("click", resetGame);


    // standButton.addEventListener("click", () => {
    //     while (dealerScore < 17) {
    //         const card = drawCard();
    //         if (card) {
    //             dealerScore += getCardValue(card);
    //             adjustForAces();
    //             const cardImg = document.createElement('img');
    //             cardImg.classList.add('deck-box');
    //             cardImg.src = `PlayingCards/${card.image}`;
    //             dealerCardsContainer.appendChild(cardImg);
    //         }
    //     }
    //     updateDealerScoreDisplay();
    //     notifyObservers("stand", { dealerScore });
    // });

    // doubleButton.addEventListener("click", () => {
    //     notifyObservers("double", {});
    // });

    // addObserver({
    //     update(event, data) {
    //         if (event === "reset") {
    //             hitButton.disabled = true;
    //         }
    //     },
    // });

    deckManager.initializeDeck();
    
}

export default function setupGameFunctions() {
    console.log("Game functions initialized");
    // Your existing setup logic here...
}
