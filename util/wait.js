import { Signal } from '../signal';
export async function wait(...args) {
    if (typeof args[0] === 'number') {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, args[0] * 1000);
        });
    }
    if (args[0] instanceof Signal) {
        const signal = args[0];
        const times = args[1] || 1;
        if (times <= 0)
            throw new Error('times must be greater than 0');
        for (let i = 0; i < times; i++) {
            await signal;
        }
        return;
    }
}
