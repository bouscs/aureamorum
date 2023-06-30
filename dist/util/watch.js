export const watch = ({ watchedProperties, onPropertiesChange, onSet }) => {
    return function (value, context) {
        return {
            get() {
                const target = this;
                const r = value.get.call(this);
                const props = new Map();
                for (const prop of watchedProperties) {
                    props.set(prop, r[prop]);
                }
                Object.defineProperties(r, watchedProperties.reduce((acc, current) => {
                    return Object.assign(Object.assign({}, acc), { get [current]() {
                            return props.get(current);
                        },
                        set [current](value) {
                            props.set(current, value);
                            onPropertiesChange === null || onPropertiesChange === void 0 ? void 0 : onPropertiesChange.call(target, value.get.call(target));
                        } });
                }, {}));
                return r;
            }
        };
    };
};
