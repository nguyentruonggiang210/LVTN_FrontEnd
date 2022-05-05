export interface BillDto {
    billId: number,
    totalAmount: number,
    createDate: Date,
    by: string,
    details: BillDetailDto[]
}

export interface BillDetailDto {
    bame: string,
    quantity: number,
    amount: number
}