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