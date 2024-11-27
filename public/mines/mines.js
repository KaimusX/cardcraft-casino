import { Board } from './board.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBQdNsOzvEgmujLUYSe4tPhqJHfkfPeIhU",
    authDomain: "cardcraft-casino.firebaseapp.com",
    projectId: "cardcraft-casino",
    storageBucket: "cardcraft-casino.appspot.com",
    messagingSenderId: "908397403086",
    appId: "1:908397403086:web:bb9751025499558a14699f",
    measurementId: "G-8C5D20HR9Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
async function getUserBalance(uid) {
    const balancesCollection = collection(db, 'Balances');
    const q = query(balancesCollection, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    return querySnapshot.empty ? null : querySnapshot.docs[0];
}

async function updateBalance(uid, amount) {
    const userDoc = await getUserBalance(uid);
    if (!userDoc) {
        console.error("User document not found for update.");
        return;
    }

    const currentBalance = Math.floor(userDoc.data().balance); // Convert to integer

    if (isNaN(currentBalance) || isNaN(amount)) {
        console.error("Error: Invalid balance or amount for update.");
        return;
    }

    const newBalance = currentBalance + Math.round(amount); // Ensure integer math
    await setDoc(userDoc.ref, { balance: newBalance }, { merge: true });
}

export { getUserBalance, updateBalance, auth };

class Mines {
    constructor(size, mines, initialBalance) {
        this.board = new Board(size, mines);
        this.balance = initialBalance;
        this.initialBalance = initialBalance;
        this.minesHit = false;
        this.updateBalance();
        this.renderBoard();
    }

    revealCell(row, col) {
        if (this.board.revealCell(row, col)) {
            if (this.board.isMine(row, col)) {
                this.balance = 0;
                alert("You hit a mine! Game over.");
                this.minesHit = true;
                this.board.revealAll();
                this.renderBoard()
                return true;
            }

            if (this.board.isDiamond(row, col)) {
                this.updateBalance(true);
                this.renderBoard();
                this.updateReward();
                return true;
            }

            this.updateBalance();
            this.renderBoard();
            this.updateReward();
            return true;
        }
    }

    winMultiplier() {
        let revealedCells = this.board.revealed.flat().filter(cell => cell).length;
        let mineRatio = this.board.mines / (this.board.size * this.board.size);
        if (mineRatio <= 0.1) {
            return 1 + (revealedCells / (this.board.size * this.board.size)) * 4;
        } else if (mineRatio <= 0.2) {
            return 1 + (revealedCells / (this.board.size * this.board.size)) * 7;
        } else {
            return 1 + (revealedCells / (this.board.size * this.board.size)) * 9;
        }
    }

    updateBalance(diamondHit = false) {
        if (diamondHit) {
            this.balance = Math.round(this.balance * this.winMultiplier() * 3); // Use integer math
        } else {
            this.balance = Math.round(this.balance * this.winMultiplier()); // Round to nearest integer
        }
        let balanceDiv = document.getElementById("AccReward");
        balanceDiv.innerHTML = `Current Balance: $${this.balance}`;
        this.updateReward();
    }

    renderBoard() {
        let gameDiv = document.getElementById("game");
        gameDiv.innerHTML = "";
        let table = document.createElement("table");
        for (let i = 0; i < this.board.size; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < this.board.size; j++) {
                let cell = document.createElement("td");
                if (this.board.revealed[i][j]) {
                    if (this.board.isMine(i, j)) {
                        cell.classList.add("mine");
                    }
                    else if (this.board.isDiamond(i, j)) {
                        cell.classList.add("diamond");
                    }
                    else {
                        cell.classList.add("revealed");
                    }
                }
                cell.addEventListener("click", () => this.revealCell(i, j));
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        gameDiv.appendChild(table);
    }

    updateReward() {
        let reward = Math.round(this.balance * this.winMultiplier());
        let rewardDiv = document.getElementById("NextReward");
        rewardDiv.innerHTML = `Next Click Reward: $${reward}`;
    }
}


export { Mines };





