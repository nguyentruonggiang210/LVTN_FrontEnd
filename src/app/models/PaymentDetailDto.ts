export interface PaymentDetailDto {
    amount: number,
    quantity: number,
    productId?: number,
    courseId?: number,
    userId?: string,
    type: number,
    promotionId?: number
}

