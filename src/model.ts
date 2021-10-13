import { Decimal, Increment, NotNull, Primary, String, Text, Unique, Unsigned } from './types/primitives'
import { Json } from './types/types'

export type City = {
  id: Increment<Unsigned<Primary<number>>>
  name: NotNull<Unique<String<50>>>
  zipCode: number
  population: number
  pollution: Decimal<8, 3>
}

export type Address = {
  id: Increment<Unsigned<Primary<number>>>
  street: string
  city: City
  info: Json
}

export type User = {
  id: Increment<Unsigned<Primary<number>>>
  name: string
  age: number
  birthday: Date
  officeAddress: Address[]
  address: Address[]
  biography: Text
}

export type Document = {
  id: Increment<Unsigned<Primary<number>>>
  owner: User
  maintainers: User[]
  signedBy: User[]
}
