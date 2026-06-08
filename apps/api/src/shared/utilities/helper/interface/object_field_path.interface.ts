export type FieldValues = { [key: string]: any };

export type Primitive = null | undefined | string | number | boolean | symbol | bigint;

export type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;

export type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;

export type PathImpl<K extends string | number, V> = V extends Primitive
    ? `${K}`
    : `${K}` | `${K}.${Path<V>}`;

export type PathValue<T, P extends Path<T>> = T extends any
    ? P extends `${infer K}.${infer R}`
        ? K extends keyof T
            ? R extends Path<T[K]>
                ? PathValue<T[K], R>
                : never
            : K extends `${number}`
              ? T extends ReadonlyArray<infer V>
                  ? PathValue<V, R & Path<V>>
                  : never
              : never
        : P extends keyof T
          ? T[P]
          : P extends `${number}`
            ? T extends ReadonlyArray<infer V>
                ? V
                : never
            : never
    : never;

export type FieldPathValue<
    TFieldValues extends FieldValues,
    TFieldPath extends FieldPath<TFieldValues>,
> = PathValue<TFieldValues, TFieldPath>;

export type Path<T> =
    T extends ReadonlyArray<infer V>
        ? IsTuple<T> extends true
            ? {
                  [K in TupleKeys<T>]-?: PathImpl<K & string, T[K]>;
              }[TupleKeys<T>]
            : PathImpl<number, V>
        : {
              [K in keyof T]-?: PathImpl<K & string, T[K]>;
          }[keyof T];

export type FieldPath<TFieldValues extends Record<string, any>> = Path<TFieldValues>;
