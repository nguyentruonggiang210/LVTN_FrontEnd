export interface ProductPromotionDto{
    promotionId: number,
    promotionName: string,
    promotionUnit: string,
    promotionDescription: string,
    amount?: number,
    lkPromotionUnitId: number
}