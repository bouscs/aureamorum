export const setClassMeta = (target, key, value) => {
    target.prototype[key] = value;
};
