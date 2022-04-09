import { DisplayPromotion } from "./DisplayPromotion";

export interface PromotionDto {
    promotionId?: number;
    unit: string,
    promotionName: string,
    promotionDescription: string,
    appliedDate: Date,
    dueDate: Date,
    amount?: number,
    quantity?: number,
    lkUnitId?: number,
    userId: string,
    productPromotions: DisplayPromotion[],
    coursePromotions: DisplayPromotion[],
}