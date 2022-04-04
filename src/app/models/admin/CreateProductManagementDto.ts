export interface CreateProductManagementDto {
    productName: string,
    weight: number,
    difficulty: number,
    userMaxWeight?: number,
    languageSupport?: number,
    price: number,
    importDate: Date,
    importOriginal: string,
    importQuantity: number,
    importPrice: number,
    country: string,
    company: string,
    description: string,
    userId: string,
    bodyFocus: string[],
    tag: string[]
}