export function cached(value, context) {
    if (context.kind === 'getter') {
        return function () {
            const result = value.call(this);
            Object.defineProperty(this, context.name, {
                value: result,
                writable: false
            });
            return result;
        };
    }
}
