export const setOnChange = (options) => {
    return function (value, context) {
        if (context.kind === 'accessor') {
            value = value;
            return {};
        }
    };
};
