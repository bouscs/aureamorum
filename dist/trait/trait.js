export const trait = (options) => {
    var _a;
    const traitName = (_a = options === null || options === void 0 ? void 0 : options.name) !== null && _a !== void 0 ? _a : 'trait';
    const symbol = Symbol(traitName);
    return {
        symbol,
        for: (target) => {
            return (decorated, context) => {
                const { name } = context;
                if (name === undefined) {
                    throw new Error('Trait must be used as a class decorator');
                }
                if (target.prototype[symbol] !== undefined) {
                    throw new Error(`Trait '${traitName}' already exists in class '${target.name}'`);
                }
                target.prototype[symbol] = new decorated();
                return function () {
                    throw new Error('Trait cannot be instantiated');
                };
            };
        },
        of: (target) => {
            return target[symbol];
        }
    };
};
