import axios from 'axios';
import { User } from '../user/User';
import { Transaction } from '../transaction/Transaction';

/**
 * коды статуса хука
 * для определения дальнейших действий,
 * например: ждать или отправлять новый
 */
export enum EnumHookRequestStatus {
    'idle',
    'error',
    'ok',
    'requesting',
}

export enum EnumHookOpCode {
    add_transaction,
    other,
}

/**
 * этот тип данных должен совпадать с типом данных что передаются с HTTP сервера
 */
export type TAxiosResponse = {
    opcode: EnumHookOpCode;
};

export interface IApp {
    update(): void;
}

export class App implements IApp {
    /**hook request status */
    private hookRequestStatus: EnumHookRequestStatus;
    private user: User;

    /**
     * на 2025.03.31
     * метод вызывает у единственного пользователя method Update
     * а так же
     * контролирует состояние хука
     */
    update() {
        this.user.update();

        if (
            this.hookRequestStatus === EnumHookRequestStatus.error ||
            this.hookRequestStatus === EnumHookRequestStatus.idle ||
            this.hookRequestStatus === EnumHookRequestStatus.ok
        ) {
            this.sendHook();
        }
    }

    /**
     * приложение кидает хук на HTTP server
     * что бы ,в случае чего, получить обратную связь ,
     * например если пользователь отправил запрос на транзакцию
     */
    private async sendHook() {
        try {
            /**
             * статус нужно установить
             * перед забросом хука
             * и в случае ответа, какой-бы он ни был
             * и в случае ошибки
             * это нужно что бы метод app::update мог обрабатывать статус
             * и принимать дальнейшие решения
             */
            this.hookRequestStatus = EnumHookRequestStatus.requesting;
            const response = await axios<TAxiosResponse>({
                method: 'post',
                // url: 'http://192.168.29.27:3000/api/hook',
                url: 'http://127.0.0.1:3000/api/hook',
            });
            const data = response.data;

            switch (data.opcode) {
                case EnumHookOpCode.add_transaction:
                    console.log('request to add transaction');
                    break;
                case EnumHookOpCode.other:
                    console.log('request to the other');
                    break;
            }

            console.log(data);

            this.hookRequestStatus = EnumHookRequestStatus.ok;
        } catch (e) {
            console.log('error');
            this.hookRequestStatus = EnumHookRequestStatus.error;
        }
    }

    // async run() {
    //     while (true) {
    //         await this.update();

    //         await new Promise<void>((res, rej) => {
    //             res();
    //         });
    //     }
    // }

    constructor() {
        this.user = new User();
        this.hookRequestStatus = EnumHookRequestStatus.idle;

        /**
         * тестовые транзакции
         */

        this.user.addTransactionIntoThePull(
            new Transaction(Date.now() + 1000, 100_000)
        );
        this.user.addTransactionIntoThePull(
            new Transaction(Date.now() + 2000, 100_000)
        );
        this.user.addTransactionIntoThePull(
            new Transaction(Date.now() + 4000, 100_000)
        );
    }
}
