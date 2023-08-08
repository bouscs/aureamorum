import { Class, Obj } from '../index.js';
export interface TraitOptions {
    name?: string;
}
export declare const trait: <TraitInterface extends Obj>(options?: TraitOptions) => {
    symbol: symbol;
    for: <TargetClass extends Class>(target: TargetClass) => (decorated: Class<TraitInterface>, context: ClassDecoratorContext) => Class<TraitInterface>;
    of: (target: Obj) => TraitInterface;
};
