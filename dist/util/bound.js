export function bound(_, context) {
    const methodName = context.name;
    if (context.private) {
        throw new Error(`'bound' cannot decorate private properties like ${methodName}.`);
    }
    context.addInitializer(function () {
        this[methodName] = this[methodName].bind(this);
    });
}
