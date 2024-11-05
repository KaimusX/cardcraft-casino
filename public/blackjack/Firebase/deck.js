// deck.js
const db = admin.firestore();

async function createDeck() {
    console.log("Creating deck...");
    const deckCollection = db.collection("Deck");
  
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
  
    const cardPromises = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        const card = {
          suit: suit,
          rank: rank,
          img: `images/${rank.toLowerCase()}_of_${suit.toLowerCase()}.png`,  // Ensure rank is lowercased
        };
        console.log("Adding card:", card);
        cardPromises.push(deckCollection.add(card));
      }
    }
  
    try {
      await Promise.all(cardPromises);
      console.log("Deck created successfully!");
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  }
  
  // Call the function when this file is executed
  createDeck().then(() => {
    console.log("Done!");
    process.exit();
  }).catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
  
