export const cachedSymbol = Symbol('cached');
export function cached(value, { kind, name }) {
    if (kind === 'getter') {
        return function () {
            if (!this[cachedSymbol])
                this[cachedSymbol] = {};
            const target = this;
            if (!this[cachedSymbol][name])
                this[cachedSymbol][name] = {
                    value: undefined,
                    clear() {
                        this.value = undefined;
                    },
                    refresh() {
                        this.value = value.call(target);
                    }
                };
            const cache = this[cachedSymbol][name];
            if (cache.value === undefined)
                cache.refresh();
            return cache.value;
        };
    }
    throw new Error(`"cached" can only decorate getters.`);
}
export const clearCached = (target, property) => {
    if (!target[cachedSymbol] || !target[cachedSymbol][property])
        return;
    target[cachedSymbol][property].clear();
};
export const refreshCached = (target, property) => {
    if (!target[cachedSymbol] || !target[cachedSymbol][property])
        return;
    target[cachedSymbol][property].refresh();
};
