import { PaymentDetailDto } from "./PaymentDetailDto";

export interface PaymentDto {
    userId: string,
    billType: number,
    paymentType: number,
    totalAmount: number,
    paymentDetails: PaymentDetailDto[]
    isCourse?: boolean,
}