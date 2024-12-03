// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, addDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your web app's Firebase configuration (ensure this matches app.js)
const firebaseConfig = {
    apiKey: "AIzaSyBQdNsOzvEgmujLUYSe4tPhqJHfkfPeIhU",
    authDomain: "cardcraft-casino.firebaseapp.com",
    projectId: "cardcraft-casino",
    storageBucket: "cardcraft-casino.appspot.com",
    messagingSenderId: "908397403086",
    appId: "1:908397403086:web:bb9751025499558a14699f",
    measurementId: "G-8C5D20HR9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// SlotMachineModel Class
class SlotMachineModel {
    constructor() {
        this.reelSymbols = [
            ['🍒', '🍋', '🍉', '🍊', '🍇', '🍓', '7️⃣', '🔔', '⭐️', '💎', '🐎', '💰'],
            ['💰', '🍊', '🍓', '7️⃣', '💎', '🍇', '🐎', '🍉', '🍒', '🔔', '⭐️', '🍋'],
            ['🐎', '🔔', '🍓', '⭐️', '🍉', '💰', '🍊', '7️⃣', '🍒', '🍋', '🍇', '💎']
        ];
        this.payouts = {
            '7️⃣': 100,
            '💰': 50,
            '💎': 30,
            '⭐️': 20,
            '🔔': 10,
            '🐎': 8,
            '🍇': 4,
            '🍉': 3,
            '🍓': 2,
            '🍒': 1,
            '🍊': 1,
            '🍋': 1
        };
        this.betAmount = 1; // Default bet amount
        this.balance = 0;    // User's balance
    }

    setBetAmount(amount) {
        this.betAmount = amount;
    }

    getBetAmount() {
        return this.betAmount;
    }

    setBalance(amount) {
        this.balance = amount;
    }

    getBalance() {
        return this.balance;
    }

    spinReels() {
        return new Promise((resolve) => {
            let reelResults = [];
            let spinsCompleted = 0;

            const reels = document.querySelectorAll('.reel'); // Assuming your reels have the class 'reel'
            reels.forEach((reel, index) => {
                const symbols = this.reelSymbols[index];
                let spinCount = 0;
                const totalSpins = Math.floor(Math.random() * 10) + 10; // Random spins between 10 and 20

                const spinInterval = setInterval(() => {
                    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

                    // Get current symbols
                    const currentSymbols = Array.from(reel.children);

                    // Shift symbols
                    currentSymbols[2].className = currentSymbols[1].className;
                    currentSymbols[2].innerHTML = currentSymbols[1].innerHTML;

                    currentSymbols[1].className = currentSymbols[0].className;
                    currentSymbols[1].innerHTML = currentSymbols[0].innerHTML;

                    // Set new symbol at the top
                    currentSymbols[0].className = 'symbol';
                    currentSymbols[0].innerHTML = `${randomSymbol}<span class="sr-only">${randomSymbol}</span>`;

                    spinCount++;
                    if (spinCount >= totalSpins) {
                        clearInterval(spinInterval);
                        reelResults[index] = reel.children[1].textContent.trim();
                        spinsCompleted++;
                        if (spinsCompleted === reels.length) {
                            resolve(reelResults);
                        }
                    }
                }, 100 + index * 100);
            });
        });
    }

    calculateWinnings(result) {
        let winnings = 0;
        if (result[0] === result[1] && result[1] === result[2]) {
            const symbol = result[0];
            winnings = (this.payouts[symbol] || 0) * this.betAmount;
        }
        return winnings;
    }
}

// SlotMachineView Class
class SlotMachineView {
    constructor() {
        this.betAmountDisplay = document.querySelector('.bet-amount');
        this.winAmountDisplay = document.querySelector('.win-amount');
        this.spinButton = document.querySelector('.spin-button');
        this.betButtons = document.querySelectorAll('.bet-button');
        this.balanceAmountDisplay = document.querySelector('.balance-amount');
    }

    updateBetAmount(betAmount) {
        this.betAmountDisplay.textContent = `$${betAmount}`;
    }

    updateWinAmount(winAmount) {
        this.winAmountDisplay.textContent = `$${winAmount}`;
    }

    updateBalanceDisplay(balance) {
        this.balanceAmountDisplay.textContent = `$${balance}`;
    }

    disableSpinButton() {
        this.spinButton.disabled = true;
    }

    enableSpinButton() {
        this.spinButton.disabled = false;
    }

    setSpinButtonClickListener(callback) {
        this.spinButton.addEventListener('click', callback);
    }

    setBetButtonClickListener(callback) {
        this.betButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const action = e.target.textContent.trim();
                callback(action);
            });
        });
    }
}

// SlotMachineController Class
class SlotMachineController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Set the initial bet display
        this.view.updateBetAmount(this.model.getBetAmount());

        // Handle bet adjustments
        this.view.setBetButtonClickListener((action) => {
            let newBetAmount = this.model.getBetAmount();

            if (action === '+') {
                newBetAmount += 1;
            } else if (action === '-' && newBetAmount > 1) {
                newBetAmount -= 1;
            }

            // Ensure bet amount does not exceed balance
            if (newBetAmount > this.model.getBalance()) {
                alert('Bet amount cannot exceed your current balance.');
                return;
            }

            this.model.setBetAmount(newBetAmount);
            this.view.updateBetAmount(newBetAmount);
        });

        // Handle spin button click
        this.view.setSpinButtonClickListener(() => {
            this.spinReels();
        });
    }

    async spinReels() {
        this.view.disableSpinButton();
        this.view.updateWinAmount(0);

        const betAmount = this.model.getBetAmount();
        const currentBalance = this.model.getBalance();

        if (betAmount > currentBalance) {
            alert('Insufficient balance to place this bet.');
            this.view.enableSpinButton();
            return;
        }

        // Deduct bet amount from balance
        const newBalance = currentBalance - betAmount;
        this.model.setBalance(newBalance);
        this.view.updateBalanceDisplay(newBalance);

        // Update balance in Firestore
        await updateBalance(auth.currentUser.uid, betAmount, 'remove');

        const result = await this.model.spinReels();
        const winnings = this.model.calculateWinnings(result);

        // Update balance with winnings
        if (winnings > 0) {
            const updatedBalance = this.model.getBalance() + winnings;
            this.model.setBalance(updatedBalance);
            this.view.updateBalanceDisplay(updatedBalance);

            // Update balance in Firestore
            await updateBalance(auth.currentUser.uid, winnings, 'add');
        }

        this.view.updateWinAmount(winnings);
        this.view.enableSpinButton();
    }
}

// Firestore Function to Fetch or Create User Balance
async function fetchOrCreateUserBalance(uid) {
    const balancesCollection = collection(db, 'Balances');
    const q = query(balancesCollection, where("uid", "==", uid));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Document exists, return balance
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            return userData.balance;
        } else {
            // No doc found, create new document with balance 0
            const newUserDocRef = await addDoc(balancesCollection, { uid: uid, balance: 0 });
            console.log("User document created with balance: 0, Document ID:", newUserDocRef.id);
            return 0;
        }
    } catch (error) {
        console.error("Error fetching or creating user balance: ", error);
        return 0;
    }
}

// Firestore Function to Update User Balance
async function updateBalance(uid, amount, operation) {
    const balancesCollection = collection(db, 'Balances');
    const q = query(balancesCollection, where("uid", "==", uid));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Document exists, update balance
            const userDoc = querySnapshot.docs[0];
            const userDocRef = userDoc.ref;
            const userData = userDoc.data();

            let newBalance;
            if (operation === 'add') {
                newBalance = userData.balance + amount;
            } else if (operation === 'remove') {
                newBalance = userData.balance - amount;
                if (newBalance < 0) newBalance = 0; // Prevent negative balance
            }

            await setDoc(userDocRef, { balance: newBalance }, { merge: true });
            console.log(`Balance updated. New balance: $${newBalance}`);
            return newBalance;

        } else {
            console.log("No user document found for updating balance.");
            return null;
        }
    } catch (error) {
        console.error("Error updating user balance: ", error);
        return null;
    }
}

// SlotMachineView already defined above

// Initialize MVC components and handle authentication state
document.addEventListener('DOMContentLoaded', () => {
    const model = new SlotMachineModel();
    const view = new SlotMachineView();
    const controller = new SlotMachineController(model, view);

    // Handle authentication state
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Fetch and set user balance
            const currentBalance = await fetchOrCreateUserBalance(user.uid);
            model.setBalance(currentBalance);
            view.updateBalanceDisplay(currentBalance);
        } else {
            // Redirect to sign-in page or display a message
            alert('Please sign in to play the game.');
            window.location.href = '../index.html'; // Adjust the path as needed
        }
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
