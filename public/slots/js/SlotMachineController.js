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
