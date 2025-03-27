import { App, IApp } from './components/app/app';

console.log('app getting started...');

const app: IApp = new App();

/**
 * запускает основной цикл
 * для беспрерывного обновления приложения
 */
async function launch(): Promise<void> {
    while (true) {
        app.update();

        await new Promise<void>((res, rej) => {
            setTimeout(() => res(), 0);
        });
    }
}

launch();

// enum OpCode {
//     load,
//     save,
//     add,
//     stop,
//     run,
// }


// let concreteCode  =  OpCode.run;
// concreteCode =OpCode.load;
// concreteCode =OpCode.save;
// concreteCode =OpCode.stop;