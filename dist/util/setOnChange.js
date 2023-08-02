export const setOnChange = (options) => {
    options;
    return function (value, context) {
        if (context.kind === 'accessor') {
            value = value;
            return {};
        }
    };
};
