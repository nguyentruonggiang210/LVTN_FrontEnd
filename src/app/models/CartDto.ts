import { CartType } from "../enums/CartType";

export interface CartDto {
    id: number,
    name: string,
    price: number,
    quantity: number,
    image: string,
    type: CartType
}