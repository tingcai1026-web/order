import { Model } from "firebase-lucid"

export default class Product extends Model {
  name!: string
  content!: string
  description!: string
  price!: number
  status!: boolean
  tags!: string[]
  static collectionName = "products"
}
