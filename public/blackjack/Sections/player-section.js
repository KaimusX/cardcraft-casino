let currentBet = 0;
let playerBalance = 100;

function setupPlayerFunctions() {
    document.querySelector("button").addEventListener("click", setBet);
}

function setBet() {
    const betInput = document.getElementById("betInput");
    const betValue = parseInt(betInput.value) || 0;

    if (betValue > 0 && betValue <= playerBalance) {
        currentBet = betValue;
        playerBalance -= betValue;
        document.getElementById("currentBet").textContent = `$${currentBet}`;
        document.getElementById("playerBalance").textContent = `$${playerBalance}`;
        betInput.style.display = "none";
        notifyGameObservers("betPlaced", { currentBet, playerBalance });
    } else {
        alert("Invalid bet!");
    }
}

function observeGameEvents(event, data) {
    if (event === "reset") {
        currentBet = 0;
        playerBalance = 100;
        document.getElementById("currentBet").textContent = `$${currentBet}`;
        document.getElementById("playerBalance").textContent = `$${playerBalance}`;
    }
}

// Register player as an observer
addObserver({ update: observeGameEvents });

setupPlayerFunctions();
