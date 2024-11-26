class SlotMachineController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Set the initial bet display
        this.view.updateBetAmount(this.model.getBetAmount());

        // Handle bet adjustments
        this.view.setBetButtonClickListener((action) => {
            if (action === '+') {
                this.model.setBetAmount(this.model.getBetAmount() + 1);
            } else if (action === '-' && this.model.getBetAmount() > 1) {
                this.model.setBetAmount(this.model.getBetAmount() - 1);
            }
            this.view.updateBetAmount(this.model.getBetAmount());
        });

        // Handle spin button click
        this.view.setSpinButtonClickListener(() => {
            this.spinReels();
        });
    }

    async spinReels() {
        this.view.disableSpinButton();
        this.view.updateWinAmount(0);

        const result = await this.model.spinReels();
        const winnings = this.model.calculateWinnings(result);

        this.view.updateWinAmount(winnings);
        this.view.enableSpinButton();
    }
}

// Initialize MVC components
const model = new SlotMachineModel();
const view = new SlotMachineView();
const controller = new SlotMachineController(model, view);