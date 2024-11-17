import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration (use the same configuration from your app.js)
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
const db = getFirestore(app);

// Fetch and display leaderboard
async function loadLeaderboard() {
    const leaderboardTable = document.getElementById('leaderboard-rows');
    const balancesCollection = collection(db, 'Balances');
    const q = query(balancesCollection, orderBy("balance", "desc")); // Order by balance (score) descending

    try {
        const querySnapshot = await getDocs(q);
        let rank = 1;

        querySnapshot.forEach(doc => {
            const { uid, balance } = doc.data();

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rank}</td>
                <td>${uid}</td>
                <td>$${balance}</td>
            `;
            leaderboardTable.appendChild(row);
            rank++;
        });
    } catch (error) {
        console.error("Error fetching leaderboard data: ", error);
    }
}

// Load leaderboard on page load
loadLeaderboard();
