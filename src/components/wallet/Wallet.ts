export class Wallet {
    private balance: number;

    income(value: number) {
        this.balance += value;
    }

    expence(value: number) {
        this.balance -= value;
    }

    getBalance(): number {
        return this.balance;
    }

    constructor(value: number) {
        this.balance = value;
    }
}
