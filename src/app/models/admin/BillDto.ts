export interface BillDto {
    billId: number,
    totalAmount: number,
    phoneNumber: string,
    address: string,
    isConfirmed: boolean,
    createDate: Date,
    by: string,
    details: BillDetailDto[]
}

export interface BillDetailDto {
    name: string,
    quantity: number,
    amount: number,
    image: string,
}