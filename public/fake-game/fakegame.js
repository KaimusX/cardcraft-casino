import { updateBalance } from '../app.js'; // Import access to balance
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Initialize Firebase authentication
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Example: Adding or removing balance
    const userId = user.uid;
    
    // To add to balance
    // updateBalance(userId, 50, 'add');
    updateBalance(userId, 50, 'remove');
  } else {
    console.log("User not authenticated");
  }
});