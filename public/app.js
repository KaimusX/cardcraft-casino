  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

  import {
    getFirestore,
    collection,
    setDoc,
    getDocs,
    addDoc,
    where,
    query
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Grab HTML elements
  const whenSignedIn = document.getElementById('whenSignedIn');
  const whenSignedOut = document.getElementById('whenSignedOut');

  const signInButton = document.getElementById('signInBtn');
  const signOutButton = document.getElementById('signOutBtn');

  const registerBtn = document.getElementById('registerBtn');
  const emailSignInBtn = document.getElementById('emailSignInBtn');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const emailSignInDiv = document.getElementById('emailSignIn');

  const userDetails = document.getElementById('userDetails');

  if(signInButton && signOutButton && whenSignedIn && whenSignedOut) {

  /// Sign in/out event handlers
  signInButton.onclick = () => {
    signInWithPopup(auth, provider)
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };

  signOutButton.onclick = () => auth.signOut();

  registerBtn.onclick = () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User registered:', userCredential.user);
        errorMessagesContainer.innerHTML = '';
      })

      .catch((error) => {
        console.error('Error registering user:', error.message);
        displayError(error.message);
      });
  };

  emailSignInBtn.onclick = () => {
    const auth = getAuth();
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User signed in:', userCredential.user);
        errorMessagesContainer.innerHTML = '';
      })
      .catch((error) => {
        console.error('Error signing in:', error.message);
        displayError(error.message);
      });
  };

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // signed in
      whenSignedIn.hidden = false;
      whenSignedOut.hidden = true;
      const currentBalance = await fetchOrCreateUserBalance(user.uid);
      userDetails.innerHTML = `
        <h5>UID: ${user.uid}</h5>
            <p class="balance-label">Balance:</p>
            <p class="balance-amount">$${currentBalance}</p>
            <div class="transfer-money-container">
              <button id="transferMoneyBtn" class="btn" onclick="window.location.href='./transfer/transfer.html'">Transfer Money</button>
            </div>
            <div class="game-selection">
                <div class="game-card blackjack" onclick="window.location.href='./blackjack/blackjack.html'">
                    <span class="game-icon">♠️</span>
                    <span class="game-name">Blackjack</span>
                </div>
                <div class="game-card mines"onclick="window.location.href='./mines/mines.html'">
                    <span class="game-icon">💣</span>
                    <span class="game-name">Mines</span>
                </div>
                <div class="game-card slots" onclick="window.location.href='./slots/slots.html'">
                    <span class="game-icon">🎰</span>
                    <span class="game-name">Slots</span>
                </div>
            </div>
            <div class="game-card leaderboard" onclick="window.location.href='./leaderboard/leaderboard.html'">
              <span class="game-icon">🏆</span>
              <span class="game-name">Leaderboard</span>
            </div>
            <!-- Add the Watch Ad button -->
            <button id="watchAdButton">Watch Ad to Earn $10</button>
            `;

      const watchAdButton = document.getElementById('watchAdButton');
      if (watchAdButton) {
        watchAdButton.addEventListener('click', () => {
          if (auth.currentUser) {
            showAdModal();
          } else {
            alert('Please sign in to watch ads and earn rewards.');
          }
        });
        
      }

    } else {
      // not signed in
      whenSignedIn.hidden = true;
      whenSignedOut.hidden = false;
      userDetails.innerHTML = "";
    }
  });
}

// Error handling
const errorMessagesContainer = document.getElementById('errorMessages');

function displayError(message) {
  errorMessagesContainer.innerHTML = '';

  const errorItem = document.createElement('li');
  errorItem.textContent = message;
  errorMessagesContainer.appendChild(errorItem);
}

  // Firestore

  const db = getFirestore(app);

  // Function to fetch user balance
  async function fetchOrCreateUserBalance(uid) {
    const balancesCollection = collection(db, 'Balances');
    const q = query(balancesCollection, where("uid", "==", uid));

    try{
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Document exists return balance
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        return userData.balance;
      } else {
        // No doc found
        const newUserDocRef = await addDoc(balancesCollection, { uid: uid, balance: 0});
        console.log("User document created with balance: 0, Document ID:", newUserDocRef.id);
        return 0;
      }
    } catch (error) {
      console.error("Error fetching or creating user balance: ", error);
      return 0;
    }
  }

  // Function to get ad video URL from GitHub
function getAdVideoURL(filename) {
  return `https://raw.githubusercontent.com/Yemosky02/ad-videos/main/${filename}`;
}

// Function to update user balance across games
export async function updateBalance(uid, amount, operation) {
  console.log("updateBalance called with:", uid, amount, operation); // Debug log
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

async function showAdModal() {
  const adModal = document.getElementById('adModal');
  const adVideo = document.getElementById('adVideo');
  const closeAdButton = document.querySelector('.close-ad-button');

  if (adModal && adVideo) {
    // Get the ad video URL
    const videoURL = getAdVideoURL('ad1.mp4'); // Adjust as needed

    if (videoURL) {
      adVideo.src = videoURL;
      adModal.style.display = 'block';
      closeAdButton.style.display = 'none'; // Hide close button until ad ends

      // Play the video
      adVideo.play();

      // When video ends
      adVideo.onended = () => {
        closeAdButton.style.display = 'block'; // Show close button
        rewardUserForAd();
      };

      // Close modal when close button is clicked
      closeAdButton.onclick = () => {
        adModal.style.display = 'none';
        adVideo.pause();
        adVideo.currentTime = 0;
        adVideo.src = '';
      };
    } else {
      alert('Failed to load ad. Please try again later.');
    }
  } else {
    console.error('Ad modal or video element not found.');
  }
}

async function rewardUserForAd() {
  const rewardAmount = 10; // Amount to reward the user

  if (auth.currentUser) {
    const newBalance = await updateBalance(auth.currentUser.uid, rewardAmount, 'add');

    if (newBalance !== null) {
      // Update balance on the page
      const balanceElement = document.querySelector('.balance-amount');
      if (balanceElement) {
        balanceElement.textContent = `$${newBalance}`;
      }
      alert(`You've earned $${rewardAmount}! Your new balance is $${newBalance}.`);
    } else {
      alert('Error updating your balance. Please try again later.');
    }
  } else {
    alert('You need to be signed in to earn rewards.');
  }
}
