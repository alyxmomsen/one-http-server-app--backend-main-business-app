import axios from 'axios';
import { User } from '../user/User';
import { Transaction } from '../transaction/Transaction';

/**
 * коды статуса хука
 * для определения дальнейших действий,
 * например: ждать или отправлять новый
 */
export enum hookRequestStatus {
    'idle',
    'error',
    'ok',
    'requesting',
}

export type TAxiosResponse = {
    foo: string;
};

export interface IApp {
    update(): void;
}

export class App implements IApp {
    /**hook request status */
    private hookRequestStatus: hookRequestStatus;
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
            this.hookRequestStatus === hookRequestStatus.error ||
            this.hookRequestStatus === hookRequestStatus.idle ||
            this.hookRequestStatus === hookRequestStatus.ok
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
            this.hookRequestStatus = hookRequestStatus.requesting;
            const response = await axios<TAxiosResponse>({
                method: 'post',
                // url: 'http://192.168.29.27:3000/api/hook',
                url: 'http://127.0.0.1:3000/api/hook',
            });
            const data = response.data;

            console.log(data);

            this.hookRequestStatus = hookRequestStatus.ok;
        } catch (e) {
            console.log('error');
            this.hookRequestStatus = hookRequestStatus.error;
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
        this.hookRequestStatus = hookRequestStatus.idle;

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
