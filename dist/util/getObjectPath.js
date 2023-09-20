export const getObjectPath = (obj, path) => {
    if (!path)
        return undefined;
    const pathArray = path.split('.');
    if (obj === undefined)
        return undefined;
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
