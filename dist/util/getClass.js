export const getClass = (object) => {
    return Object.getPrototypeOf(object).constructor;
};
