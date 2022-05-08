export interface BillDto {
    billId: number,
    totalAmount: number,
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