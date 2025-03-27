import { Transaction } from '../transaction/Transaction';
import { Wallet } from '../wallet/Wallet';

export class User {
    private wallet: Wallet;

    /**
     * Currently, transactions are stored here
     */
    private transactionsPull: Transaction[];

    addTransactionIntoThePull(transaction: Transaction) {
        this.transactionsPull.push(transaction);
    }

    update() {
        this.updateTransactionPull();
    }

    /**
     * Method to iterate through all pending transactions
     */
    private updateTransactionPull() {
        /**
         * First, create a new empty pool
         */
        const updatedTransactions: Transaction[] = [];

        /**
         * Continue the loop while there are still unprocessed transactions in the old pool
         */
        while (this.transactionsPull.length) {
            /**
             * Pull out one transaction
             */
            const transaction = this.transactionsPull.shift();
            if (transaction === undefined) continue;
            /**
             * Update the state of the transaction
             */
            transaction.update(this.wallet);
            /**
             * If the transaction was successful (status True), ignore it
             */
            if (transaction.getStatus() === true) continue;
            /**
             * If the transaction was not successful, add it to the temporary pool
             */
            updatedTransactions.push(transaction);
        }

        /**
         * Copy the temporary pool to the main one
         */
        this.transactionsPull = [...updatedTransactions];
    }

    constructor() {
        this.transactionsPull = [];
        const initValue = 0;
        this.wallet = new Wallet(initValue);
    }
}
