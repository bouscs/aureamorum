var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Signal } from '../signal';
export function wait(...args) {
    return __awaiter(this, void 0, void 0, function* () {
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
                yield signal;
            }
            return;
        }
    });
}
