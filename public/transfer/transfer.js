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

document.getElementById('transferForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const recipientUid = document.getElementById('uid').value.trim();
  const transferAmount = parseFloat(document.getElementById('amount').value);

  const errorMessages = document.getElementById('errorMessages');
  const successMessage = document.getElementById('successMessage');

  errorMessages.innerHTML = '';
  successMessage.innerHTML = '';

  if (!auth.currentUser) {
    displayError('You must be signed in to transfer money.');
    return;
  }

  if (transferAmount <= 0) {
    displayError('Transfer amount must be greater than zero.');
    return;
  }

  try {
    const senderUid = auth.currentUser.uid;

    // Fetch sender's balance
    const senderBalanceDoc = await getUserBalanceDoc(senderUid);
    if (!senderBalanceDoc) {
      displayError('Your account does not exist.');
      return;
    }

    const senderBalance = senderBalanceDoc.data().balance;

    if (senderBalance < transferAmount) {
      displayError('Insufficient balance.');
      return;
    }

    // Fetch recipient's balance
    const recipientBalanceDoc = await getUserBalanceDoc(recipientUid);
    if (!recipientBalanceDoc) {
      displayError('Recipient account not found.');
      return;
    }

    // Update balances
    await updateBalance(senderUid, -transferAmount);
    await updateBalance(recipientUid, transferAmount);

    successMessage.textContent = `Successfully transferred $${transferAmount} to UID ${recipientUid}.`;
  } catch (error) {
    console.error(error);
    displayError('An error occurred while processing the transfer.');
  }
});

// Helper functions
async function getUserBalanceDoc(uid) {
  const balancesCollection = collection(db, 'Balances');
  const q = query(balancesCollection, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.empty ? null : querySnapshot.docs[0];
}

async function updateBalance(uid, amount) {
  const userDoc = await getUserBalanceDoc(uid);
  if (!userDoc) return;

  const userDocRef = userDoc.ref;
  const currentBalance = userDoc.data().balance;

  await setDoc(userDocRef, { balance: currentBalance + amount }, { merge: true });
}

function displayError(message) {
  const errorItem = document.createElement('li');
  errorItem.textContent = message;
  document.getElementById('errorMessages').appendChild(errorItem);
}