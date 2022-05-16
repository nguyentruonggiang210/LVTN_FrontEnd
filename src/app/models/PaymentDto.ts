import { PaymentDetailDto } from "./PaymentDetailDto";

export interface PaymentDto {
    userId: string,
    billType: number,
    paymentType: number,
    totalAmount: number,
    address: string,
    phoneNumber: string,
    name: string,
    paymentDetails: PaymentDetailDto[]
}