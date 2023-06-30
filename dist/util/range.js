export const range = (length, start = 0) => {
    return Array.from({ length }, (_, index) => index + start);
};
