export type Primitive = string | number | boolean // json, date, etc

export interface JsonMap {
  [member: string]: string | number | boolean | null | JsonArray | JsonMap
}
export interface JsonArray extends Array<string | number | boolean | null | JsonArray | JsonMap> {}

type DatetimeOpt = { useTz?: boolean; precision?: number }

export type Json = JsonMap | JsonArray | string | number | boolean | null
export type Datetime<Opt extends DatetimeOpt = {}> = Date
export type Blob = Int16Array
export type Decimal<D extends number = 8, F extends number = 2> = string
export type Int = number
export type BigInt = bigint
export type Text = string
export type String<T extends number> = string
export type WithDefault<T, Arg extends string | number> = T
export type OnDelete<T, Arg extends string> = T
export type OnUpdate<T, Arg extends string> = T
export type NotNull<T> = T
export type Unique<T> = T
export type Primary<T> = T
export type Increment<T> = T
export type Unsigned<T> = T
