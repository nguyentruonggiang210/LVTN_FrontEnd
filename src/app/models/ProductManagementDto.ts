export interface ProductManagementDto {
    productId: number,
    productName: string,
    importDate?: Date,
    bought?: number,
    remainQuantity?: number,
    price: number,
    image: string,
    status: boolean
}