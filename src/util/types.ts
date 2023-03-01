/**
 * Caminho de um objeto, no formato 'propriedade1.propriedade2.propriedade3'
 * Computa o tipo de um objeto a partir de um caminho de propriedades.
 * Se o caminho for inválido, retorna 'never'.
 */
export type ObjectPath<
  O,
  Path extends string
> = Path extends `${infer K}.${infer Rest}`
  ? K extends keyof O
    ? ObjectPath<O[K], Rest>
    : never
  : Path extends keyof O
  ? O[Path]
  : never

export type TupleToSum<T extends unknown[]> = T extends [infer L, ...infer R]
  ? L extends unknown
    ? R extends unknown[]
      ? L | TupleToSum<R>
      : L
    : unknown
  : unknown

export type NestedPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<NestedPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<NestedPartial<U>>
    : T[P] extends Record<string | number | symbol, unknown>
    ? NestedPartial<T[P]>
    : T[P]
}

export type Class<T = any> = { new (...args: any[]): T }
