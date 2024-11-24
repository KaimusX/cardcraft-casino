import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth(app);

// Get current authenticated user
export function getCurrentUser(callback) {
    onAuthStateChanged(auth, callback);
}

// Fetch or create user balance
export async function fetchOrCreateUserBalance(uid) {
    const balancesCollection = collection(db, 'Balances');
    const q = query(balancesCollection, where("uid", "==", uid));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return userDoc.data().balance;
        } else {
            const newUserDocRef = await addDoc(balancesCollection, { uid: uid, balance: 100 }); // Default balance
            console.log("Created new user with balance: $100");
            return 100;
        }
    } catch (error) {
        console.error("Error fetching/creating user balance:", error);
        return 0;
    }
}

// Update user balance
export async function updateUserBalance(uid, amount, operation) {
    const balancesCollection = collection(db, 'Balances');
    const q = query(balancesCollection, where("uid", "==", uid));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userDocRef = userDoc.ref;
            const currentBalance = userDoc.data().balance;

            let newBalance;
            if (operation === "add") {
                newBalance = currentBalance + amount;
            } else if (operation === "subtract") {
                newBalance = Math.max(0, currentBalance - amount);
            }

            await setDoc(userDocRef, { balance: newBalance }, { merge: true });
            console.log(`Balance updated. New balance: $${newBalance}`);
            return newBalance;
        } else {
            console.error("No user document found for updating balance.");
            return null;
        }
    } catch (error) {
        console.error("Error updating user balance:", error);
        return null;
    }
}
