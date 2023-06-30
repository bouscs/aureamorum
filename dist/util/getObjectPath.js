export const getObjectPath = (obj, path) => {
    const pathArray = path.split('.');
    let current = obj;
    for (let i = 0; i < pathArray.length; i++) {
        if (current[pathArray[i]] === undefined) {
            return undefined;
        }
        else {
            current = current[pathArray[i]];
        }
    }
    return current;
};
