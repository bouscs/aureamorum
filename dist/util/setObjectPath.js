export const setObjectPath = (obj, path, value, onSet) => {
    const pathArray = path.split('.');
    let current = obj;
    for (let i = 0; i < pathArray.length - 1; i++) {
        if (current[pathArray[i]] === undefined) {
            current[pathArray[i]] = {};
        }
        current = current[pathArray[i]];
        if (onSet)
            onSet(pathArray.slice(0, i + 1).join('.'), current[pathArray[i]]);
    }
    current[pathArray[pathArray.length - 1]] = value;
    if (onSet)
        onSet(path, value);
};
