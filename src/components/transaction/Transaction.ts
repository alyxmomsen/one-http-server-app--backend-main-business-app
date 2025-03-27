import { Wallet } from '../wallet/Wallet';

export class Transaction {
    private date: number;
    private executed: boolean;
    private value: number;

    private execute() {
        this.executed = true;
    }

    /**
     *
     * @returns состояние транзакции
     */
    getStatus(): boolean {
        return this.executed;
    }

    /**
     * для нижеследующего метода
     * необходимо добавить поведенческие сервисы
     * для расширения возможных действий
     * в случае выполнения транзакции
     * например design pattern Стратегия или Состояние
     */

    /**
     *
     * @description проверяет не пора ли выполнить транезакцию,
     * и если пора, то выполняет
     * @param wallet
     * @returns void
     *
     */
    update(wallet: Wallet) {
        const now = Date.now();

        if (this.date > now) return;

        wallet.income(this.value); // test
        this.execute();
        console.log('transaction updated');
    }

    constructor(date: number, value: number) {
        this.value = value;
        this.date = date;
        this.executed = false;
    }
}
