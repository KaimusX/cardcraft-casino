// DeckManager Singleton: Ensures only one deck instance exists
const DeckManager = (function () {
    let instance;

    function createInstance() {
        const suits = ["spades", "hearts", "diamonds", "clubs"];
        const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
        let deck = [];

        function initializeDeck() {
            deck = [];
            suits.forEach(suit => {
                ranks.forEach(rank => {
                    const card = {
                        rank,
                        suit,
                        image: `${rank}_of_${suit}.png`
                    };
                    deck.push(card);
                });
            });
            shuffleDeck();
        }

        function shuffleDeck() {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
        }

        function drawCard() {
            return deck.length > 0 ? deck.pop() : null;
        }

        return {
            initializeDeck,
            drawCard,
            getDeck: () => deck,
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
                instance.initializeDeck();
            }
            return instance;
        },
    };
})();

export default DeckManager;
