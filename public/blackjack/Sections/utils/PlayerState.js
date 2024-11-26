import { getCurrentUser, updateUserBalance } from './firebaseUtils.js';

class PlayerState {
    constructor() {
        if (!PlayerState.instance) {
            this.playerBalance = 0; // Initial balance
            this.currentBet = 0; // Initial bet
            this.playerScore = 0; // Player's current score
            this.dealerScore = 0; // Dealer's current score
            PlayerState.instance = this; // Ensure Singleton
        }
        return PlayerState.instance;
    }

    // Get the player's current balance
    getBalance() {
        return this.playerBalance;
    }

    // Set the player's balance and update Firebase
    async setBalance(newBalance) {
        if (typeof newBalance !== "number" || isNaN(newBalance) || newBalance < 0) {
            console.error("Invalid balance provided to setBalance:", newBalance);
            return;
        }
    
        this.playerBalance = newBalance;
    
        // Debug: Log balance before Firebase update
        console.log(`Preparing to update Firebase with balance: $${this.playerBalance}`);
    
        // Update Firebase
        const user = await getCurrentUser();
        if (user) {
            try {
                await updateUserBalance(user.uid, this.playerBalance, "set");
                console.log(`Player balance updated: $${this.playerBalance} (Firebase synced)`);
            } catch (error) {
                console.error("Error syncing balance with Firebase:", error);
            }
        } else {
            console.error("User not signed in. Firebase update skipped.");
        }
    }
    
    

    // Get the player's current bet
    getBet() {
        return this.currentBet;
    }

    // Set the player's current bet
    setBet(newBet) {
        if (typeof newBet !== "number" || newBet < 0) {
            console.error("Invalid bet:", newBet);
            return;
        }
        this.currentBet = newBet;
        console.log(`Player bet updated: $${this.currentBet}`);
    }

    // Player score methods
    getPlayerScore() {
        return this.playerScore;
    }

    setPlayerScore(newScore) {
        if (typeof newScore !== "number" || newScore < 0) {
            console.error("Invalid player score:", newScore);
            return;
        }
        this.playerScore = newScore;
        console.log(`Player score updated: ${this.playerScore}`);
    }

    // Dealer score methods
    getDealerScore() {
        return this.dealerScore;
    }

    setDealerScore(newScore) {
        if (typeof newScore !== "number" || newScore < 0) {
            console.error("Invalid dealer score:", newScore);
            return;
        }
        this.dealerScore = newScore;
        console.log(`Dealer score updated: ${this.dealerScore}`);
    }

    async reset() {
        // Ensure balance is valid before resetting
        if (typeof this.playerBalance !== "number" || isNaN(this.playerBalance)) {
            console.error("Invalid balance detected during reset:", this.playerBalance);
            this.playerBalance = 0; // Reset to a safe default
        }
    
        // Log the reset action
        console.log(`Resetting player state. Current balance: $${this.playerBalance}, Current bet: $${this.currentBet}`);
    
        // Sync the remaining balance with Firebase
        const user = await getCurrentUser();
        if (user) {
            try {
                await updateUserBalance(user.uid, this.playerBalance, "set");
                console.log(`Reset: Balance synced to Firebase. New balance: $${this.playerBalance}`);
            } catch (error) {
                console.error("Error syncing reset state with Firebase:", error);
            }
        } else {
            console.error("User not signed in. Firebase sync skipped.");
        }
    
        // Reset local state
        this.currentBet = 0;
        this.playerScore = 0;
        this.dealerScore = 0;
    }
    
    
}

// Create and export the Singleton instance
const instance = new PlayerState();
export default instance;
