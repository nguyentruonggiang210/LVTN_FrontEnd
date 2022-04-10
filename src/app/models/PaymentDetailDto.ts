import { CartType } from "../enums/CartType"

export interface PaymentDetailDto {
    amount: number,
    quantity: number,
    productId?: number,
    courseId?: number,
    userId?: string,
    type: number
}

