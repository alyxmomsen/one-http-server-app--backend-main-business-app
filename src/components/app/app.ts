import axios from 'axios';

export enum requestStatus {
    'idle',
    'error',
    'ok',
    'requesting',
}

export type TAxiosResponse = {
    foo: string;
};

export class App {
    private status: requestStatus;

    private async update() {
        // console.log('update');
        if (
            this.status === requestStatus.error ||
            this.status === requestStatus.idle ||
            this.status === requestStatus.ok
        ) {
            await this.hook();
        }
    }

    private async hook() {
        console.log('hook inside');
        try {
            this.status = requestStatus.requesting;

            const response = await axios<TAxiosResponse>({
                method: 'post',
                url: 'http://192.168.29.27:3000/api/hook',
            });

            const data = response.data;

            console.log(data);

            this.status = requestStatus.ok;
        } catch (e) {
            console.log('error');
            this.status = requestStatus.error;
        }
    }

    async run() {
        while (true) {
            await this.update();

            await new Promise<void>((res, rej) => {
                res();
            });
        }
    }

    constructor() {
        this.status = requestStatus.idle;
    }
}
